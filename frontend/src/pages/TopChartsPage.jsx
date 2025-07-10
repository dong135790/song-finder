import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Stack, Typography, Button } from '@mui/material'
const TopChartsPage = ({ topChartsData, setCurrentSong }) => {

  useEffect(() => {
    console.log(topChartsData)
  }, [topChartsData])


  return (
    <Box>
      <Typography textAlign={'center'} mt={8} mb={2}
        sx={{
          fontWeight: 600,
          fontSize: '20px'
        }}
      >
        Top Albums Today
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 2,
          padding: 2,
        }}>
        {topChartsData.map((data, index) => (
          <Box
            key={index}
            sx={{
              border: 'solid',
              borderColor: '#fff',
              borderRadius: '20px'
            }}

          >
            <Stack direction={'column'} gap={1}>
              <img src={data.attributes.artwork.url} alt={data.attributes.artwork.url}
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
                {data.attributes.albumName}
              </Typography>
              <Link to={`/artist/${data.attributes.artistName}`}>
                <Typography
                  sx={{
                    textAlign: 'left',
                    fontWeight: 500,
                    fontSize: '14px',
                    ml: 2,
                    mr: 2,
                    mb: 1
                  }}
                >
                  {data.attributes.artistName}
                </Typography>
              </Link>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>

  )
}

export default TopChartsPage