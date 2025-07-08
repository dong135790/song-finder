import react, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Box, Stack, Typography } from '@mui/material'

import TopArtists from './components/TopArtists'
import TopCharts from './components/TopCharts'
import Navigation from './components/Navigation'
import SongPlayer from './components/SongPlayer'

import HomePage from './pages/HomePage'
import TopArtistsPage from './pages/TopArtistsPage'
import TopChartsPage from './pages/TopChartsPage'

import './App.css'

function App() {
  const [genre, setGenre] = useState("")
  const [discoveryData, setDiscoveryData] = useState([])
  const [topChartsData, setTopChartsData] = useState([])

  useEffect(() => {

    // For discovery
    // const initialData = async () => {
    //   const res = await fetch("http://localhost:8080/api/shazam/multi-search?query=classic");
    //   const data = await res.text();
    //   // console.log(data);
    //   setGenre('classic');
    //   setDiscoveryData(data);
    // }

    // For top Charts
    const getTopChartData = async () => {
      const res = await fetch("http://localhost:8080/api/shazam/charts");
      const data = await res.json();
      console.log("Top Charts: ", data);
      setTopChartsData(data);
    }
    // // initialData();
    getTopChartData();
  }, [])

  return (
    <Box display={'flex'} flexDirection={'column'} height={'90vh'}>
      {/* Left */}
      <Box display={'flex'} flexDirection={'row'}>
        <Box sx={{ minWidth: '300px', height: '90vh', bgcolor: '#1d0a27'}}>
          <Navigation />
        </Box>
        {/* Middle */}
        <Box sx={{ minWidth: '900px', height: '90vh' }}>
          <Routes>
            <Route path='/' element={<HomePage discoveryData={discoveryData} />} />
            <Route path='/topartists' element={<TopArtistsPage />} />
            <Route path='/topcharts' element={<TopChartsPage topChartsData={topChartsData} />} />
          </Routes>
        </Box>
        {/* Right */}
        <Box
          sx={{
            overflowY: 'auto',
            height: '90vh',
            minWidth: '300px'
          }}
        >
          <Stack>
            <TopCharts topChartsData={topChartsData} />
            <TopArtists />
          </Stack>
        </Box>
      </Box>
      {/* Bottom */}
      <Box>
        <SongPlayer />
      </Box>
    </Box>
  )
}

export default App
