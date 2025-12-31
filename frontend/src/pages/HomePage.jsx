import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

import SearchBar from "../components/SearchBar";
import Discovery from "../components/Discovery";

const API_BASE = "https://song-finder-emcn.onrender.com";

const HomePage = ({ setCurrentSong }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState({ songs: [], artists: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Anti-spam / rate-limit protection ---
  const lastSearchAtRef = useRef(0);
  const inFlightRef = useRef(false);
  const abortRef = useRef(null);

  // HomePage.jsx
  const onSearch = async (query, type = "songs") => {
    const trimmed = (query || "").trim();
    if (trimmed.length < 2) return;

    const now = Date.now();

    // cooldown
    if (now - lastSearchAtRef.current < 1200) return;

    // in flight
    if (inFlightRef.current) return;

    lastSearchAtRef.current = now;
    inFlightRef.current = true;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setError("");
      setLoading(true);
      setSearchQuery(trimmed);

      const url = `${API_BASE}/api/shazam/search?query=${encodeURIComponent(
        trimmed
      )}&type=${encodeURIComponent(type)}&offset=0`;

      const res = await fetch(url, { signal: controller.signal });

      if (res.status === 429) {
        setError("Rate limited (429). Try again in ~30–60 seconds.");
        setSearchData({ songs: [], artists: [] });
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setError(`Search failed (${res.status}). ${txt || ""}`.trim());
        setSearchData({ songs: [], artists: [] });
        return;
      }

      const data = await res.json();

      // ✅ RapidAPI search/multi returns results inside data.data
      const resultsArray = Array.isArray(data?.data) ? data.data : [];

      if (type === "artists") {
        setSearchData({
          songs: [],
          artists: resultsArray,
        });
      } else {
        setSearchData({
          songs: resultsArray,
          artists: [],
        });
      }
    } catch (e) {
      if (e?.name === "AbortError") return;
      console.error("Search failed:", e);
      setError("Search failed. Check console for details.");
      setSearchData({ songs: [], artists: [] });
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "white", mb: 1 }}>
        Discover
      </Typography>

      <SearchBar onSearch={onSearch} />

      {error ? (
        <Typography sx={{ mt: 1, color: "#ffb4b4", fontSize: 13 }}>
          {error}
        </Typography>
      ) : null}

      <Discovery
        searchQuery={searchQuery}
        searchData={searchData}
        loading={loading}
        setCurrentSong={setCurrentSong}
      />
    </Box>
  );
};

export default HomePage;
