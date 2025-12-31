import { shazamClient } from "../config/config.js";

const simplifySong = (item) => {
  const a = item?.attributes || {};
  const previewUrl = a?.previews?.[0]?.url || null;

  return {
    id: item?.id ?? null,
    title: a?.name ?? null,
    artist: a?.artistName ?? null,
    album: a?.albumName ?? null,
    artworkUrl: a?.artwork?.url ?? null,
    previewUrl,
    hasPreview: Boolean(previewUrl),
  };
};

const simplifyArtist = (item) => {
  const a = item?.attributes || {};
  return {
    id: item?.id ?? null,
    name: a?.name ?? null,
    genres: a?.genreNames ?? [],
    artworkUrl: a?.artwork?.url ?? null,
    url: a?.url ?? null,
  };
};

/**
 * GET /api/shazam/search?query=metallica&type=songs|artists|both&offset=0
 *
 * Now `type=both` makes ONE RapidAPI call using search_type=SONGS_ARTISTS
 * and splits results locally.
 */
export const searchShazam = async (req, res) => {
  try {
    const query = (req.query.query || "").toString().trim();
    const type = (req.query.type || "songs").toString().toLowerCase();
    const offset = Number(req.query.offset ?? 0);

    if (!query) {
      return res.status(400).json({ message: "Missing required query param: query" });
    }
    if (Number.isNaN(offset) || offset < 0) {
      return res.status(400).json({ message: "offset must be a non-negative number" });
    }

    // Map to RapidAPI search_type
    // NOTE: Shazam Core supports SONGS_ARTISTS for the multi search endpoint
    const search_type =
      type === "artists" ? "ARTISTS" :
      type === "both" ? "SONGS_ARTISTS" :
      "SONGS";

    const r = await shazamClient.get("/v1/search/multi", {
      params: { query, search_type, offset },
    });

    const items = Array.isArray(r?.data?.data) ? r.data.data : [];

    // Split and simplify so frontend gets stable arrays
    const songs = items
      .filter((x) => x?.type === "songs")
      .map(simplifySong)
      .filter((s) => s?.id && s?.title); // optional cleanup

    const artists = items
      .filter((x) => x?.type === "artists")
      .map(simplifyArtist)
      .filter((a) => a?.id && a?.name); // optional cleanup

    // For type=songs, return only songs; for type=artists, only artists
    // but keep the same envelope so your frontend never breaks.
    return res.status(200).json({
      query,
      offset,
      songs: type === "artists" ? [] : songs,
      artists: type === "songs" ? [] : artists,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message;

    console.error(`Cannot search Shazam... status=${status} details=`, details);

    return res.status(status).json({
      message: "Server Error trying to search Shazam",
      details,
    });
  }
};


/**
 * GET /api/shazam/top?seed=top%20hits&offset=0
 * Clean list: songs[] with previewUrl if available
 */
export const getWorldChart = async (req, res) => {
  try {
    const seed = (req.query.seed || "top hits").toString().trim();
    const offset = Number(req.query.offset ?? 0);

    if (!seed) {
      return res.status(400).json({ message: "Missing required query param: seed" });
    }
    if (Number.isNaN(offset) || offset < 0) {
      return res.status(400).json({ message: "offset must be a non-negative number" });
    }

    const response = await shazamClient.get("/v1/search/multi", {
      params: { query: seed, search_type: "SONGS", offset },
    });

    const items = response?.data?.data ?? [];
    const songs = items.map(simplifySong);

    return res.status(200).json({
      ok: true,
      seed,
      offset,
      count: songs.length,
      songs,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message;

    return res.status(status).json({
      ok: false,
      message: "Server Error trying to get TOP FALLBACK",
      details,
    });
  }
};

/**
 * GET /api/shazam/artist?query=drake&offset=0
 * Clean list: artists[]
 */
export const searchArtists = async (req, res) => {
  try {
    const query = (req.query.query || "").toString().trim();
    const offset = Number(req.query.offset ?? 0);

    if (!query) {
      return res.status(400).json({ message: "Missing required query param: query" });
    }
    if (Number.isNaN(offset) || offset < 0) {
      return res.status(400).json({ message: "offset must be a non-negative number" });
    }

    const response = await shazamClient.get("/v1/search/multi", {
      params: { query, search_type: "ARTISTS", offset },
    });

    const items = response?.data?.data ?? [];
    const artists = items.map(simplifyArtist);

    return res.status(200).json({
      ok: true,
      query,
      offset,
      count: artists.length,
      artists,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message;

    return res.status(status).json({
      ok: false,
      message: "Server Error trying to search ARTISTS",
      details,
    });
  }
};



/**
 * GET request: Get songs for an artist (by artistId + storefront)
 *
 * Backend route:
 *   GET /api/shazam/artist/:artistId/songs?storefront=bg&limit=25&offset=0
 *
 * It tries multiple catalog endpoints until one works:
 *   1) /v1/catalog/{storefront}/artists/{id}/view/top-songs
 *   2) /v1/catalog/{storefront}/artists/{id}/songs
 */
export const getArtistSongs = async (req, res) => {
  try {
    const { artistId } = req.params;
    const storefront = (req.query.storefront || "us").toString().trim().toLowerCase();
    const limit = Number(req.query.limit ?? 25);
    const offset = Number(req.query.offset ?? 0);

    if (!artistId) {
      return res.status(400).json({ message: "Missing artistId" });
    }
    if (!storefront) {
      return res.status(400).json({ message: "Missing storefront" });
    }
    if (Number.isNaN(limit) || limit <= 0 || limit > 100) {
      return res.status(400).json({ message: "limit must be between 1 and 100" });
    }
    if (Number.isNaN(offset) || offset < 0) {
      return res.status(400).json({ message: "offset must be a non-negative number" });
    }

    const candidates = [
      {
        label: "top-songs",
        path: `/v1/catalog/${storefront}/artists/${artistId}/view/top-songs`,
        params: { limit, offset },
      },
      {
        label: "songs-relationship",
        path: `/v1/catalog/${storefront}/artists/${artistId}/songs`,
        params: { limit, offset },
      },
    ];

    let lastErr = null;

    for (const c of candidates) {
      try {
        const response = await shazamClient.get(c.path, { params: c.params });
        return res.status(200).json({
          ok: true,
          source: c.label,
          artistId,
          storefront,
          limit,
          offset,
          results: response.data,
        });
      } catch (err) {
        const status = err?.response?.status;
        // if it's 404 or 400, try the next candidate
        if (status === 404 || status === 400) {
          lastErr = err;
          continue;
        }
        // for other errors, stop immediately
        throw err;
      }
    }

    const status = lastErr?.response?.status || 404;
    const details = lastErr?.response?.data || lastErr?.message;

    return res.status(status).json({
      ok: false,
      message: "Could not find an artist songs endpoint that works for this API/key",
      tried: candidates.map((c) => c.path),
      details,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message;

    return res.status(status).json({
      ok: false,
      message: "Server Error trying to get ARTIST SONGS",
      details,
    });
  }
};


/**
 * GET /api/shazam/artist-songs?artist=Drake&offset=0
 * Clean list: songs[] filtered by exact artist name match
 */
export const getSongsByArtistName = async (req, res) => {
  try {
    const artist = (req.query.artist || "").toString().trim();
    const offset = Number(req.query.offset ?? 0);

    if (!artist) {
      return res.status(400).json({ message: "Missing required query param: artist" });
    }
    if (Number.isNaN(offset) || offset < 0) {
      return res.status(400).json({ message: "offset must be a non-negative number" });
    }

    const response = await shazamClient.get("/v1/search/multi", {
      params: { query: artist, search_type: "SONGS", offset },
    });

    const items = response?.data?.data ?? [];

    // Filter to songs where the artistName matches (best effort)
    const songs = items
      .filter((x) => (x?.attributes?.artistName || "").toLowerCase() === artist.toLowerCase())
      .map(simplifySong);

    return res.status(200).json({
      ok: true,
      artist,
      offset,
      count: songs.length,
      songs,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message;

    return res.status(status).json({
      ok: false,
      message: "Server Error trying to get SONGS BY ARTIST NAME",
      details,
    });
  }
};

