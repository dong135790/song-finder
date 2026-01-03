import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, Typography, IconButton, Divider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const API_BASE = "https://song-finder-emcn.onrender.com";

const ArtistDetail = ({ setCurrentSong }) => {
  const { artistName } = useParams();
  const artist = useMemo(() => decodeURIComponent(artistName || ""), [artistName]);

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistSongs = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/api/shazam/artist-songs?artist=${encodeURIComponent(artist)}&offset=0`
        );
        const data = await res.json();

        setSongs(Array.isArray(data?.songs) ? data.songs : []);
      } catch (e) {
        console.error("Artist songs fetch failed:", e);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    if (artist) fetchArtistSongs();
  }, [artist]);

  // Use first song artwork as the banner image (album art fallback)
  const bannerImage = songs?.[0]?.artworkUrl || "";

  return (
    <Box sx={{ pb: 3 }}>
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          height: 220,
          px: 3,
          pt: 3,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "#12071a",
        }}
      >
        {/* background image */}
        {bannerImage && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(18px)",
              transform: "scale(1.2)",
              opacity: 0.6,
            }}
          />
        )}

        {/* dark overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(18,7,26,0.40) 0%, rgba(18,7,26,0.92) 75%, rgba(18,7,26,1) 100%)",
          }}
        />

        {/* foreground content */}
        <Box sx={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 2 }}>
          {/* artist image (square) */}
          {bannerImage ? (
            <Box
              component="img"
              src={bannerImage}
              alt={artist}
              sx={{
                width: 110,
                height: 110,
                borderRadius: 3,
                objectFit: "cover",
                boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
                flexShrink: 0,
              }}
            />
          ) : (
            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: 3,
                background: "rgba(255,255,255,0.10)",
                flexShrink: 0,
              }}
            />
          )}

          <Box sx={{ pb: 1 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              ARTIST
            </Typography>
            <Typography variant="h3" sx={{ color: "white", fontWeight: 800, lineHeight: 1.1 }}>
              {artist}
            </Typography>

            <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 1 }}>
              {loading ? "Loading songs..." : `${songs.length} songs`}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Songs list */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.2 }} />

        {songs.length === 0 && !loading ? (
          <Typography sx={{ opacity: 0.75 }}>No songs found.</Typography>
        ) : (
          <Stack spacing={1}>
            {songs.map((song, idx) => {
              const title = song?.title || "Unknown Title";
              const artworkUrl = song?.artworkUrl || "";
              const canPlay = Boolean(song?.previewUrl);

              return (
                <Box
                  key={song?.id ?? idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.25,
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  <Typography sx={{ width: 28, opacity: 0.7 }}>{idx + 1}</Typography>

                  <Box
                    component="img"
                    src={artworkUrl}
                    alt={title}
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      objectFit: "cover",
                      backgroundColor: "rgba(0,0,0,0.08)",
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: "white" }} noWrap>
                      {title}
                    </Typography>
                    <Typography sx={{ opacity: 0.75, fontSize: 12, color: "white" }} noWrap>
                      {artist}
                    </Typography>
                  </Box>

                  <IconButton
                    disabled={!canPlay}
                    onClick={() => {
                      if (canPlay) setCurrentSong(song);
                    }}
                    sx={{ color: "white", opacity: canPlay ? 1 : 0.4}}
                    aria-label={`Play ${title}`}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ArtistDetail;
