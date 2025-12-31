import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import Navigation from "./components/Navigation";
import SongPlayer from "./components/SongPlayer";

import HomePage from "./pages/HomePage";
import TopChartsPage from "./pages/TopChartsPage";
import ArtistDetail from "./pages/ArtistDetail";

import "./App.css";

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <Box display="flex" flexDirection="column" height="90vh">
      <Box display="flex" flexDirection="row" width="100%">
        {/* Left */}
        <Box sx={{ width: "15%", minWidth: 200, height: "90vh", bgcolor: "#1d0a27" }}>
          <Navigation />
        </Box>

        {/* Middle (now takes full remaining space) */}
        <Box sx={{ flex: 1, minWidth: 600, height: "90vh", overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<HomePage setCurrentSong={setCurrentSong} />} />
            <Route
              path="/artist/:artistName"
              element={<ArtistDetail setCurrentSong={setCurrentSong} />}
            />
            {/* TopChartsPage will fetch on-demand */}
            <Route
              path="/topcharts"
              element={<TopChartsPage setCurrentSong={setCurrentSong} />}
            />
          </Routes>
        </Box>
      </Box>

      <Box>
        <SongPlayer song={currentSong} />
      </Box>
    </Box>
  );
}

export default App;
