import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { Box, Stack, Typography, Button } from '@mui/material'

const TopArtists = ({ topChartsData, setCurrentSong }) => {

//     const [limitData, setLimitData] = useState([]);

//     useEffect(() => {
//         const limitEightTop = topChartsData.slice(0, 6);
//         setLimitData(limitEightTop)
//         console.log(limitData)
//         let artistName = []
//         for (let item of limitEightTop) {
//             let artist = item.attributes.artistName;
//             console.log(artist)
//         }

        

//             // const initialData = async () => {
//     //   const res = await fetch("http://localhost:8080/api/shazam/multi-search?query=classic");
//     //   const data = await res.text();
//     //   // console.log(data);
//     //   setGenre('classic');
//     //   setDiscoveryData(data);
//     // }


//     }, [topChartsData])


//     if (limitData.length == 0) {
//         return (
//             <Typography>
//                 Top charts loading...
//             </Typography>
//         )
//     }

//     return (
//         <Box>
//             <Stack direction={'row'} display={'flex'} justifyContent={'space-between'}>
//                 <Typography sx={{ fontWeight: 800, fontSize: '24px', textAlign: 'center' }}>
//                     Top Artists
//                 </Typography>
//                 <Link to='topcharts' sx={{ ml: 'auto' }}>
//                     <Button>Show more</Button>
//                 </Link>
//             </Stack>
//         </Box>
//     )
}

export default TopArtists