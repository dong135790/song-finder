import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Stack, Typography, Button } from '@mui/material'

const TopArtists = () => {
    return (
        <Box>
            <Stack direction={'row'} display={'flex'} justifyContent={'space-between'}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', textAlign: 'center' }}>
                    Top Artists
                </Typography>
                <Link to='topcharts' sx={{ ml: 'auto' }}>
                    <Button>Show more</Button>
                </Link>
            </Stack>
        </Box>
    )
}

export default TopArtists