import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Box, Stack, Button } from '@mui/material';

const ArtistDetail = ({ setCurrentSong }) => {
    const { artistName } = useParams();
    const [artistData, setArtistData] = useState([]);
    // console.log(artistName)

    useEffect(() => {
        const getArtistData = async () => {
            let artist = artistName.replace(/[()[\]{}-]/g, '').trim()
            const queryArtist = encodeURIComponent(artist)
            let finalArtist = ""
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
            const res = await fetch(`http://localhost:8080/api/shazam/multi-search?query=${finalArtist}`)
            const data = await res.json()
            setArtistData(data);
            // console.log(data)
        }
        getArtistData();
    }, [artistName])

    if (!artistData || artistData.length == 0) {
        return (
            <Typography>Loading artist data...</Typography>
        )
    }

    return (
        <Box mt={10}>
            {/* ArtistName and image */}
            <Box>
                <Stack direction={'row'} m={5} display={'flex'} alignItems={'center'}>
                    <img src={artistData?.tracks?.hits[0]?.track?.images?.background}
                        style={{
                            width: '300px',
                            height: 'auto',
                            borderRadius: '50%'
                        }}
                    />
                    <Typography
                        sx={{
                            ml: '100px',
                            textTransform: 'capitalize',
                            fontWeight: 500,
                            fontSize: '20px'
                        }}
                    >
                        {artistData?.tracks?.hits[0]?.track?.subtitle}
                    </Typography>
                </Stack>
            </Box>
            {/* Songs by artist */}
            <Box
                sx={{
                    bgcolor: '#260f31',
                    pt: 2
                }}
            >
                {artistData?.tracks?.hits.map((data, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: '99%',
                            height: '10vh',
                            alignItems: 'center',
                            display: 'flex',
                            mb: 1
                        }}

                    >
                        <Stack direction={'row'} alignItems={'center'} gap={2} flexGrow={1}>

                            <Typography ml={2}>
                                {index + 1}.
                            </Typography>
                            <img src={data.track.images.coverart} alt={data.track.images.coverart}
                                style={{
                                    overflow: 'hidden',
                                    objectFit: 'cover',
                                    width: '99px',
                                    height: 'auto',
                                    borderRadius: '20px'

                                }}
                            />
                            <Typography>
                                {data.track.title}
                            </Typography>
                        </Stack>
                        <Button
                            sx={{

                            }}
                            onClick={() => setCurrentSong(data.track)}
                        >
                            Play
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default ArtistDetail