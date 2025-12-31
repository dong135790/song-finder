import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const TopChartsPage = ({ topChartsData = [] }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Top Charts
      </Typography>

      {topChartsData.length === 0 ? (
        <Typography sx={{ opacity: 0.8 }}>
          No songs loaded yet.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {topChartsData.map((song, idx) => (
            <Box
              key={song.id || idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
              }}
            >
              {/* index */}
              <Typography sx={{ width: 28, opacity: 0.7 }}>
                {idx + 1}
              </Typography>

              {/* artwork */}
              <Box
                component="img"
                src={song.artworkUrl}
                alt={song.title}
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 2,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              {/* title/artist */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }} noWrap>
                  {song.title}
                </Typography>

                <Typography
                  sx={{ opacity: 0.8 }}
                  noWrap
                  component={Link}
                  to={`/artist/${encodeURIComponent(song.artist || "")}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {song.artist}
                </Typography>
              </Box>

              {/* preview badge */}
              <Typography sx={{ opacity: 0.8, fontSize: 12 }}>
                {song.hasPreview ? "Preview ✅" : "No preview"}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      <Divider sx={{ mt: 3, opacity: 0.2 }} />
    </Box>
  );
};

export default TopChartsPage;
