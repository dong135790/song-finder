import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TopCharts from "../components/TopCharts";

const API_BASE = "https://song-finder-emcn.onrender.com";

/**
 * ✅ Dedupe + cache across StrictMode effect re-runs:
 * - First call kicks off the fetch
 * - Any duplicate call reuses the same promise
 * - Once resolved, result is cached
 */
let topChartsPromise = null;
let topChartsCache = null;

function getTopCharts() {
  if (topChartsCache) return Promise.resolve(topChartsCache);

  if (!topChartsPromise) {
    topChartsPromise = fetch(`${API_BASE}/api/shazam/top?seed=top%20songs&offset=0`)
      .then(async (res) => {
        if (!res.ok) {
          const retryAfter = res.headers.get("Retry-After");
          const text = await res.text().catch(() => "");
          throw new Error(
            `Top charts failed (${res.status}).` +
              (retryAfter ? ` Retry-After: ${retryAfter}s.` : "") +
              (text ? ` Body: ${text.slice(0, 200)}` : "")
          );
        }
        return res.json();
      })
      .then((data) => {
        topChartsCache = data; // cache full payload
        return data;
      })
      .finally(() => {
        topChartsPromise = null; // allow future refreshes if you want
      });
  }

  return topChartsPromise;
}

export default function TopChartsPage({ setCurrentSong }) {
  const [topChartsData, setTopChartsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setError("");

    getTopCharts()
      .then((data) => {
        if (!alive) return;
        setTopChartsData(Array.isArray(data?.songs) ? data.songs : []);
      })
      .catch((e) => {
        if (!alive) return;
        console.error("Top charts fetch failed:", e);
        setTopChartsData([]);
        setError(e?.message || "Failed to load Top Charts.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <Box sx={{ p: 0 }}>
      {loading && (
        <Box sx={{ p: 2 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>
            Loading Top Charts...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Box sx={{ p: 2 }}>
          <Typography sx={{ color: "#ffb3b3", whiteSpace: "pre-wrap" }}>
            {error}
          </Typography>
        </Box>
      )}

      {!loading && !error && (
        <TopCharts topChartsData={topChartsData} setCurrentSong={setCurrentSong} />
      )}
    </Box>
  );
}
