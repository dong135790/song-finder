import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Stack, Typography, Button } from '@mui/material'


const TopCharts = ({ topChartsData }) => {
    const [limitData, setLimitData] = useState([])

    useEffect(() => {
        const limitEightTop = topChartsData.slice(0, 6);
        setLimitData(limitEightTop)
    }, [topChartsData])

    if (limitData.length == 0) {
        return (
            <Typography>
                Top charts loading...
            </Typography>
        )
    }
    return (
        <>
            <Stack direction={'row'} mt={10} display={'flex'} justifyContent={'space-between'}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', textAlign: 'center'}}>
                    Top Charts
                </Typography>
                <Link to='topcharts' sx={{ ml: 'auto'}}>
                    <Button>Show more</Button>
                </Link>
            </Stack>

            {limitData.map((data, index) => (
                <Box
                    sx={{
                        height: '12vh',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}
                    key={index}
                >
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        sx={{
                            flex: 1, minWidth: 0, overflow: 'hidden'
                        }}
                        gap={1}
                    >
                        <Box
                            sx={{
                                width: '100px',
                                height: '80%',
                                flexShrink: 0,
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={data.attributes.artwork.url}
                                alt={data.attributes.albumName}
                                loading='lazy'
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </Box>
                        <Stack direction={'column'}>
                            <Typography sx={{ fontWeight: '800', fontSize: '30' }}>
                                {data.attributes.albumName}
                            </Typography>
                            <Typography sx={{ textTransform: 'capitalize' }}>
                                {data.attributes.artistName}
                            </Typography>
                        </Stack>
                        <Button sx={{ ml: 'auto'}}>
                                Play
                        </Button>
                    </Stack>
                </Box >
            ))}
        </>
    )
}

export default TopCharts