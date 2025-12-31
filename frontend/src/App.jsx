import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, Stack } from "@mui/material";

import Navigation from "./components/Navigation";
import TopCharts from "./components/TopCharts";
import SongPlayer from "./components/SongPlayer";

import HomePage from "./pages/HomePage";
import TopChartsPage from "./pages/TopChartsPage";
import ArtistDetail from "./pages/ArtistDetail";

import "./App.css";

function App() {
  const [genre, setGenre] = useState("classic");
  const [discoveryData, setDiscoveryData] = useState([]);
  const [topChartsData, setTopChartsData] = useState([]);
  const [currentSong, setCurrentSong] = useState([]);

  useEffect(() => {
    const getTopChartData = async () => {
      try {
        const res = await fetch(
          "https://song-finder-emcn.onrender.com/api/shazam/top?seed=top%20songs&offset=0"
        );
        const data = await res.json();

        // store only the array
        setTopChartsData(Array.isArray(data?.songs) ? data.songs : []);
      } catch (err) {
        console.error("Top charts fetch failed:", err);
        setTopChartsData([]);
      }
    };

    getTopChartData();
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="90vh">
      {/* Top: Left / Middle / Right */}
      <Box display="flex" flexDirection="row" width="100%">
        {/* Left */}
        <Box sx={{ width: "15%", minWidth: 200, height: "90vh", bgcolor: "#1d0a27" }}>
          <Navigation />
        </Box>

        {/* Middle */}
        <Box sx={{ width: "70%", minWidth: 600, height: "90vh", overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<HomePage setCurrentSong={setCurrentSong} />} />
            <Route
              path="/artist/:artistName"
              element={<ArtistDetail setCurrentSong={setCurrentSong} />}
            />
            <Route
              path="/topcharts"
              element={<TopChartsPage topChartsData={topChartsData} />}
            />
          </Routes>
        </Box>

        {/* Right */}
        <Box sx={{ width: "25%", minWidth: 200, height: "90vh", overflowY: "auto" }}>
          <Stack>
            <TopCharts topChartsData={topChartsData} setCurrentSong={setCurrentSong} />
          </Stack>
        </Box>
      </Box>
      {/* Bottom */}
      <Box>
        <SongPlayer song={currentSong} />
      </Box>
    </Box>
  );
}

export default App;
