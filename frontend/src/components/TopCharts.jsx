import React from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Link } from "react-router-dom";

const TopCharts = ({ topChartsData = [], setCurrentSong }) => {
  const songs = Array.isArray(topChartsData) ? topChartsData : [];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "white" }}>
        Top Charts
      </Typography>

      <Stack spacing={1}>
        {songs.slice(0, 20).map((song, idx) => {
          const title = song?.title || "Unknown Title";
          const artist = song?.artist || "Unknown Artist";
          const artworkUrl = song?.artworkUrl || "";
          const canPlay = Boolean(song?.previewUrl);

          return (
            <Box
              key={song?.id ?? idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1,
                borderRadius: 2,
                opacity: canPlay ? 1 : 0.6,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
              }}
            >
              <Typography sx={{ width: 22, color: "rgba(255,255,255,0.65)" }}>
                {idx + 1}
              </Typography>

              <Box
                component="img"
                src={artworkUrl}
                alt={title}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  objectFit: "cover",
                  flexShrink: 0,
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              />

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ color: "white", fontWeight: 600 }} noWrap>
                  {title}
                </Typography>

                {/* ✅ Artist goes to artist page */}
                <Typography
                  component={Link}
                  to={`/artist/${encodeURIComponent(artist)}`}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  noWrap
                >
                  {artist}
                </Typography>
              </Box>

              {/* ✅ Only plays if you press play */}
              <IconButton
                disabled={!canPlay}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canPlay) setCurrentSong(song);
                }}
                sx={{ color: "white", opacity: canPlay ? 1 : 0.4 }}
                aria-label={`Play ${title}`}
              >
                <PlayArrowIcon />
              </IconButton>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default TopCharts;
