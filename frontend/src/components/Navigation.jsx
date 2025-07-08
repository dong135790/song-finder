import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Stack, Typography, Button } from '@mui/material'
const Navigation = () => {
    return (
        <Box mt={10}>
            <Stack direction={'column'}>
                <Link to='/'>
                    <Button sx={{ textTransform: 'capitalize', fontWeight: 500, fontSize: '20px' }}>
                        Discover
                    </Button>
                </Link>
                <Link to='/topcharts'>
                    <Button sx={{ textTransform: 'capitalize', fontWeight: 500, fontSize: '20px' }}>
                        Top Charts
                    </Button>
                </Link>
                <Link to='topartists'>
                    <Button sx={{ textTransform: 'capitalize', fontWeight: 500, fontSize: '20px' }}>
                        Top Artists
                    </Button>
                </Link>
            </Stack>
        </Box>
    )
}

export default Navigation