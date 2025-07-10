import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Stack, Typography, Button } from '@mui/material'


const TopCharts = ({ topChartsData, setCurrentSong }) => {
    const [limitData, setLimitData] = useState([])

    const filterSongData = async (albumName, artistName) => {
        // console.log(albumName)
        // console.log(artistName)
        try {
            let album = albumName.replace(/[()[\]{}-]/g, '').trim()
            let artist = artistName.replace(/[()[\]{}-]/g, '').trim()
            const queryAlbum = encodeURIComponent(album)
            const queryArtist = encodeURIComponent(artist)
            let finalAlbum = ""
            let finalArtist = ""
            if (queryAlbum.length > 25) {
                let items = queryAlbum.split(/(?=%)/);
                for (let item of items) {
                    if ((finalAlbum + item).length <= 20) {
                        finalAlbum += item;
                    } else {
                        continue;
                    }
                }
            } else {
                finalAlbum = queryAlbum
            }
            if (queryArtist.length > 25) {
                let items = queryArtist.split(/(?=%)/);
                for (let item of items) {
                    if ((finalArtist + item).length <= 20) {
                        finalArtist += item;
                    } else {
                        continue;
                    }
                }
            } else {
                finalArtist = queryArtist
            }

            const res = await fetch(`http://localhost:8080/api/shazam/search-album-songs?albumName=${finalAlbum}&artistName=${finalArtist}`);

            const data = await res.json();
            // console.log(data.tracks.hits)
            setCurrentSong(data.tracks.hits[0].track);
        } catch (error) {
            console.log("Failed to fetch: " + error)
        }
    }

    useEffect(() => {
        const limitEightTop = topChartsData.slice(0, 10);
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
            <Stack direction={'row'} mt={5} display={'flex'} justifyContent={'space-between'}>
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
                        <Button 
                            sx={{ ml: 'auto'}}
                            onClick={() => filterSongData(data.attributes.albumName, data.attributes.artistName)}
                        >
                                Play
                        </Button>
                    </Stack>
                </Box >
            ))}
        </>
    )
}

export default TopCharts