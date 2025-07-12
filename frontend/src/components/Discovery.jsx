import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Stack, Typography, TextField, Button, capitalize } from '@mui/material'
const Discovery = ({ discoveryData, genre, setGenre }) => {

  const [genreType, setGenreType] = useState(genre)
  const [musicData, setMusicData] = useState([])
  const [searchInput, setSearchInput] = useState('')

  const GENRES = [
    'pop', 'hip hop', 'rock', 'country', 'jazz', 'electronic', 'classical', 'blues', 'r&b', 'metal', 'k-pop'
  ];


  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      setGenre(searchInput.trim())
    }
  }
  useEffect(() => {
    console.log(discoveryData)
    setGenreType(genre)
    setMusicData(discoveryData)
  }, [discoveryData, genre])

  if (!discoveryData || musicData.length == 0) {
    return (
      <Typography>Loading...</Typography>
    )
  }

  return (
    <Box mt={3} ml={3} mr={3} alignItems={'center'}>
      <Stack direction={'row'} display={'flex'} justifyContent={'center'}>
        <TextField
          size="small"
          placeholder="Search genre or artist"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ width: '750px', backgroundColor: '#a982bc', borderRadius: '4px' }}
        />
        <Button onClick={handleSearch} variant="contained">
          <Typography textTransform={'capitalize'}>
            Search
          </Typography>
        </Button>
      </Stack>


      <Box mt={4}>
        <Stack direction={'row'} display={'flex'} justifyContent={'space-between'}>
          <Typography 
            sx={{
              fontWeight: '600',
              fontSize: '20px'
            }}
          >
            Discover {genreType} 
          </Typography>
          <Box>
            <select
              value={genreType}
              onChange={(e) => {
                setGenreType(e.target.value)
                setGenre(e.target.value)
              }}
              style={{
                padding: '6px',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              {GENRES.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </Box>

        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 2,
            padding: 2,
          }}>
          {musicData.tracks.hits.map((data, index) => (
            <Box key={index}
              sx={{
                border: 'solid',
                borderColor: '#fff',
                borderRadius: '20px'
              }}>
              <Stack direction={'column'}
                sx={{

                }}
              >
                <img src={data.track?.images?.coverart} alt={data.track?.images?.coverart}
                  style={{
                    borderRadius: '20px 20px 0px 0px'
                  }}
                />

                <Typography
                  sx={{
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '14px',
                    mt: 1,
                    ml: 2,
                    mr: 2
                  }}
                >
                  {data.track.title}
                </Typography>
                <Link to={`/artist/${data.track.subtitle}`}>
                  <Typography
                    sx={{
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '14px',
                      mt: 1,
                      ml: 2,
                      mr: 2
                    }}
                  >
                    {data.track.subtitle}
                  </Typography>
                </Link>
              </Stack>
            </Box>
          ))}

        </Box>
      </Box>
    </Box >
  )
}

export default Discovery