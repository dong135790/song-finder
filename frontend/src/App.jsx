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
import ArtistDetail from './pages/ArtistDetail'

import './App.css'

function App() {
  const [genre, setGenre] = useState("classic")
  const [discoveryData, setDiscoveryData] = useState([])
  const [topChartsData, setTopChartsData] = useState([])
  const [currentSong, setCurrentSong] = useState([])

  useEffect(() => {
    // For discovery
    console.log(genre)
    const timer = setTimeout(() => {
      const initialData = async () => {
        try {
          const res = await fetch(`https://song-finder-backend-de05213bfcc8.herokuapp.com/api/shazam/multi-search?query=${genre}`);
          const data = await res.json();
          setDiscoveryData(data);
        } catch (err) {
          console.error("Discovery fetch failed: ", err)
        }
      }
      initialData();

    }, 1000);
    return () => clearTimeout(timer);
  }, [genre])

  useEffect(() => {
    // For top Charts
    const getTopChartData = async () => {
      const res = await fetch("https://song-finder-backend-de05213bfcc8.herokuapp.com/api/shazam/charts");
      const data = await res.json();
      setTopChartsData(data);
    }
      getTopChartData();
  }, [])

  return (
    <Box display={'flex'} flexDirection={'column'} height={'90vh'}>
      {/* Left */}
      <Box display={'flex'} flexDirection={'row'} width={'100%'}>
        <Box sx={{ width: '15%', minWidth: '200px', height: '90vh', bgcolor: '#1d0a27' }}>
          <Navigation />
        </Box>
        {/* Middle */}
        <Box sx={{
          width: '70%',
          minWidth: '600px',
          height: '90vh',
          overflowY: 'auto'
        }}>
          <Routes>
            <Route path='/' element={<HomePage discoveryData={discoveryData} genre={genre} setGenre={setGenre}/>} />
            {/* <Route path='/topartists' element={<TopArtistsPage />} /> */}
            <Route path='/artist/:artistName' element={<ArtistDetail setCurrentSong={setCurrentSong}/>}/>
            <Route path='/topcharts' element={<TopChartsPage topChartsData={topChartsData} />} />
          </Routes>
        </Box>
        {/* Right */}
        <Box
          sx={{
            overflowY: 'auto',
            height: '90vh',
            minWidth: '200px',
            width: '25%'
          }}
        >
          <Stack>
            <TopCharts topChartsData={topChartsData} setCurrentSong={setCurrentSong} />
            <TopArtists topChartsData={topChartsData} setCurrentSong={setCurrentSong} />
          </Stack>
        </Box>
      </Box>
      {/* Bottom */}
      <Box>
        <SongPlayer song={currentSong} />
      </Box>
    </Box>
  )
}

export default App
