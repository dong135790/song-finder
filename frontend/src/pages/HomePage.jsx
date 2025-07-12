import react, { useState, useEffect } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import Discovery from '../components/Discovery'

const HomePage = ({ discoveryData, genre, setGenre }) => {
  return (
    <>
        <Discovery discoveryData={discoveryData} genre={genre} setGenre={setGenre}/>
    </>
  )
}

export default HomePage