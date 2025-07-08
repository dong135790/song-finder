import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
const Discovery = () => {
  return (
    <Box mt={3} ml={3} mr={3}>
        <Typography> Search </Typography>

        <Box mt={4}>
            <Stack direction={'row'} display={'flex'} justifyContent={'space-between'}>
                <Typography>Discover ____ </Typography>
                <Typography>Dropdown</Typography>
            </Stack>
        </Box>
    </Box>
  )
}

export default Discovery