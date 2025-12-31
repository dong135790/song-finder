import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const API_BASE = "https://song-finder-emcn.onrender.com";

/**
 * ✅ Dedupe + cache across StrictMode effect re-runs
 * - First call kicks off the fetch
 * - Duplicate mounts reuse the same promise
 * - Result is cached
 */
let classicPromise = null;
let classicCache = null;

function getClassic() {
  if (classicCache) return Promise.resolve(classicCache);

  if (!classicPromise) {
    classicPromise = fetch(`${API_BASE}/api/shazam/top?seed=classic&offset=0`)
      .then(async (res) => {
        if (!res.ok) {
          const retryAfter = res.headers.get("Retry-After");
          const text = await res.text().catch(() => "");
          throw new Error(
            `Discovery fetch failed (${res.status}).` +
              (retryAfter ? ` Retry-After: ${retryAfter}s.` : "") +
              (text ? ` Body: ${text.slice(0, 200)}` : "")
          );
        }
        return res.json();
      })
      .then((data) => {
        classicCache = data; // cache payload
        return data;
      })
      .finally(() => {
        classicPromise = null;
      });
  }

  return classicPromise;
}

const normalizeSong = (item) => {
  if (!item) return null;

  // already normalized (your backend returns title/artworkUrl/etc)
  if (item.title || item.artworkUrl) return item;

  // raw apple music shape (just in case)
  const a = item.attributes || {};
  const previewUrl = a?.previews?.[0]?.url || null;

  return {
    id: item.id ?? null,
    title: a.name ?? "Unknown Title",
    artist: a.artistName ?? "Unknown Artist",
    artworkUrl: a?.artwork?.url ?? "",
    previewUrl,
    hasPreview: Boolean(previewUrl),
  };
};

export default function Discovery({
  searchQuery = "",
  searchData = { songs: [], artists: [] },
  loading = false,
  setCurrentSong,
}) {
  const [defaultSongs, setDefaultSongs] = useState([]);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [defaultError, setDefaultError] = useState("");

  const songsToShow = useMemo(() => {
    if (searchQuery?.trim()) {
      return (Array.isArray(searchData?.songs) ? searchData.songs : [])
        .map(normalizeSong)
        .filter(Boolean);
    }
    return (Array.isArray(defaultSongs) ? defaultSongs : [])
      .map(normalizeSong)
      .filter(Boolean);
  }, [searchQuery, searchData, defaultSongs]);

  useEffect(() => {
    let alive = true;

    setDefaultLoading(true);
    setDefaultError("");

    getClassic()
      .then((data) => {
        if (!alive) return;
        setDefaultSongs(Array.isArray(data?.songs) ? data.songs : []);
      })
      .catch((e) => {
        if (!alive) return;
        console.error("Default discovery fetch failed:", e);
        setDefaultSongs([]);
        setDefaultError(e?.message || "Failed to load discovery songs.");
      })
      .finally(() => {
        if (!alive) return;
        setDefaultLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const isLoading = loading || defaultLoading;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ color: "white", fontWeight: 800, mb: 0.5 }}>
        {searchQuery?.trim() ? `Results for "${searchQuery}"` : "Discover Classic"}
      </Typography>

      <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 13, mb: 2 }}>
        {isLoading
          ? "Loading..."
          : defaultError && !searchQuery?.trim()
          ? defaultError
          : `${songsToShow.length} songs`}
      </Typography>

      {songsToShow.length === 0 && !isLoading ? (
        <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
          No songs found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 2,
          }}
        >
          {songsToShow.slice(0, 30).map((song, idx) => {
            const title = song?.title || "Unknown Title";
            const artist = song?.artist || "Unknown Artist";
            const artworkUrl = song?.artworkUrl || "";
            const canPlay = Boolean(song?.previewUrl);

            return (
              <Box
                key={song?.id ?? idx}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.07)" },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={artworkUrl}
                    alt={title}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    }}
                  />

                  <IconButton
                    disabled={!canPlay}
                    onClick={() => {
                      if (canPlay && setCurrentSong) setCurrentSong(song);
                    }}
                    sx={{
                      position: "absolute",
                      right: 8,
                      bottom: 8,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      color: "white",
                      opacity: canPlay ? 1 : 0.35,
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.70)" },
                    }}
                    aria-label={`Play ${title}`}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Box>

                <Box sx={{ p: 1.5 }}>
                  <Typography sx={{ color: "white", fontWeight: 700 }} noWrap>
                    {title}
                  </Typography>

                  <Typography
                    component={Link}
                    to={`/artist/${encodeURIComponent(artist)}`}
                    sx={{
                      display: "inline-block",
                      mt: 0.5,
                      color: "rgba(255,255,255,0.72)",
                      fontSize: 12,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    noWrap
                  >
                    {artist}
                  </Typography>

                  <Typography sx={{ mt: 0.75, color: "rgba(255,255,255,0.60)", fontSize: 12 }}>
                    {canPlay ? "Playable" : "No preview"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
