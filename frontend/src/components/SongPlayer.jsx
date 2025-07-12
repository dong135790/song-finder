import React, { useEffect, useState, useRef } from 'react'
import { Box, IconButton, Slider, Stack, Typography } from '@mui/material'
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const SongPlayer = ({ song }) => {
  const songRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  // console.log(song)
  const songUrl = song?.hub?.actions?.[1]?.uri;
  // console.log(songUrl)

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;

    const timeUpdate = () => setPosition(audio.currentTime);
    const durationUpdate = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', timeUpdate)
    audio.addEventListener('loadedmetadata', durationUpdate)
    audio.play();
    setIsPlaying(true)
    return () => {
      audio.removeEventListener('timeupdate', timeUpdate)
      audio.removeEventListener('loadedmetadata', durationUpdate)
    }
  }, [songUrl])

  const playSong = () => {
    const audio = songRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying)
  }
  const songDurationTracker = (event, value) => {
    const audio = songRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setPosition(value);
  }

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;
    audio.volume = volume
  }, [volume])


  if (!songUrl) {
    return (
          <Box
      sx={{
        border: 'solid',
        borderColor: '#fff',
        height: '10vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Stack direction={'row'} alignItems={'center'}>
          <Stack direction={'column'}
            sx={{
              ml: '15px'
            }}
          >
            <Typography>
              Please select a song
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'column'}>
          {/* Icons and controls */}
          <IconButton disableRipple onClick={() => playSong()}>
            {isPlaying ? <PauseIcon sx={{ color: '#fff'}} /> : <PlayArrowIcon sx={{ color: '#fff'}} />}
          </IconButton>
          {/* Slider and song length */}
          <Stack direction={'row'} gap={2}>
            <Typography> 0:{Math.floor(position)} </Typography>
            <Slider
              min={0}
              max={duration}
              value={position}
              onChange={songDurationTracker}
              sx={{
                minWidth: '200px',
                width: '300px'
              }}
            />
            <Typography ml={1}> 0:{Math.floor(duration)} </Typography>
          </Stack>
        </Stack>
        <Stack direction={'column'} alignItems={'center'}>
          {/* Volume */}
          <Typography
            sx={{
              // mt: 5
              ml: -5
            }}
          >
            Volume
          </Typography>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e, volume) => setVolume(volume)}
            sx={{ minWidth: '150px', width: '200px', mr: 5 }}
          />
        </Stack>
      </Stack>
    </Box>
    )
  }

  return (
    <Box
      sx={{
        border: 'solid',
        borderColor: '#fff',
        height: '10vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <audio ref={songRef} src={songUrl} preload='metadata' />
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        {/* Images/songinfo */}
        <Stack direction={'row'} alignItems={'center'}>
          <img src={song.images.coverart} alt={song.images.coverart}
            style={{
              objectFit: 'cover',
              width: '90px',
              height: '90px',
              marginTop: 5,
              marginLeft: 15,
              borderRadius: '50%'
            }}
          />
          <Stack direction={'column'}
            sx={{
              ml: '15px'
            }}
          >
            <Typography>
              {song.title}
            </Typography>
            <Typography>
              {song.subtitle}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'column'}>
          {/* Icons and controls */}
          <IconButton disableRipple onClick={() => playSong()}>
            {isPlaying ? <PauseIcon sx={{ color: '#fff'}} /> : <PlayArrowIcon sx={{ color: '#fff'}} />}
          </IconButton>
          {/* Slider and song length */}
          <Stack direction={'row'} gap={2}>
            <Typography> 0:{Math.floor(position)} </Typography>
            <Slider
              min={0}
              max={duration}
              value={position}
              onChange={songDurationTracker}
              sx={{
                minWidth: '200px',
                width: '300px'
              }}
            />
            <Typography ml={1}> 0:{Math.floor(duration)} </Typography>
          </Stack>
        </Stack>
        <Stack direction={'column'} alignItems={'center'}>
          {/* Volume */}
          <Typography
            sx={{
              // mt: 5
              ml: -5
            }}
          >
            Volume
          </Typography>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e, volume) => setVolume(volume)}
            sx={{ minWidth: '150px', width: '200px', mr: 5 }}
          />
        </Stack>
      </Stack>
    </Box>
  )
}

export default SongPlayer