import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const SongPlayer = ({ song }) => {
  const songRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // ✅ NEW shape (your backend): { title, artist, artworkUrl, previewUrl }
  const previewUrl = song?.previewUrl || null;
  const title = song?.title || song?.name || song?.heading?.title || "Unknown Title";
  const artist = song?.artist || song?.subtitle || song?.heading?.subtitle || "Unknown Artist";
  const artworkUrl = song?.artworkUrl || song?.images?.coverart || "";

  // ✅ OLD shape fallback (previous API response): song.hub.actions[1].uri
  const oldUrl = song?.hub?.actions?.[1]?.uri || null;

  const songUrl = previewUrl || oldUrl;

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setPosition(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);

    // whenever the URL changes, reset and autoplay
    if (songUrl) {
      audio.currentTime = 0;
      audio.volume = volume;

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [songUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const audio = songRef.current;
    if (!audio || !songUrl) return;

    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});

    setIsPlaying(!isPlaying);
  };

  const seek = (event, value) => {
    const audio = songRef.current;
    if (!audio || !songUrl) return;
    audio.currentTime = value;
    setPosition(value);
  };

  // ---------- UI ----------
  return (
    <Box
      sx={{
        borderTop: "1px solid rgba(255,255,255,0.25)",
        height: "10vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "#12071a",
      }}
    >
      <audio ref={songRef} src={songUrl || undefined} preload="metadata" />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: "100%" }}>
        {/* Left: artwork + info */}
        <Stack direction="row" alignItems="center" sx={{ pl: 2, minWidth: 260 }}>
          {artworkUrl ? (
            <img
              src={artworkUrl}
              alt={title}
              style={{
                objectFit: "cover",
                width: 56,
                height: 56,
                borderRadius: 12,
              }}
            />
          ) : (
            <Box sx={{ width: 56, height: 56, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
          )}

          <Stack sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography sx={{ color: "#fff", fontWeight: 600 }} noWrap>
              {songUrl ? title : "Please select a song"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }} noWrap>
              {songUrl ? artist : " "}
            </Typography>
          </Stack>
        </Stack>

        {/* Middle: play + scrub */}
        <Stack direction="column" alignItems="center" sx={{ flex: 1 }}>
          <IconButton disableRipple onClick={togglePlay} disabled={!songUrl}>
            {isPlaying ? <PauseIcon sx={{ color: "#fff" }} /> : <PlayArrowIcon sx={{ color: "#fff" }} />}
          </IconButton>

          <Stack direction="row" alignItems="center" gap={2} sx={{ width: 420, maxWidth: "60vw" }}>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12, width: 40 }}>
              {Math.floor(position)}s
            </Typography>

            <Slider
              min={0}
              max={duration || 0}
              value={Math.min(position, duration || 0)}
              onChange={seek}
              disabled={!songUrl}
            />

            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12, width: 40, textAlign: "right" }}>
              {Math.floor(duration)}s
            </Typography>
          </Stack>
        </Stack>

        {/* Right: volume */}
        <Stack direction="column" alignItems="center" sx={{ pr: 2, width: 220 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
            Volume
          </Typography>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e, v) => setVolume(v)}
            sx={{ width: 180 }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SongPlayer;
