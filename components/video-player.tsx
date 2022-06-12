import React, { FC, useState, useRef, useEffect, ReactEventHandler, MouseEventHandler } from 'react';
import { Box, AspectRatio, Stack, VStack, Text } from '@chakra-ui/react'

export interface VideoMetadata {
  src: string;
  poster?: string;
  title: string;
  shortTitle: string;
  description: string;
  startTimeStamp: number;
  endTimeStamp: number;
}

const VideoPlayer: FC<VideoMetadata> = ({ src, title, shortTitle, description, startTimeStamp, endTimeStamp, poster }) => {
  const videoElement = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [readyToPlay, setReadyToPlay] = useState(false)
  let duration;

  const togglePlayback: MouseEventHandler<HTMLButtonElement> = (): void => {
    if (playing) {
      videoElement.current.play()
    } else {
      videoElement.current.pause()
    }
    setPlaying(!playing)
  };

  const setDuration: ReactEventHandler<HTMLVideoElement> = (e): void => {
    const el = e.target as HTMLVideoElement
    duration = el.duration
  }

  useEffect(() => {
    const videoEl: HTMLVideoElement = videoElement.current
    const canplayEventListener: EventListener = (e: Event): void => { console.log('Video Ready To Play') }
    videoEl.addEventListener('canplay', canplayEventListener)
    return () => {
      videoEl.removeEventListener('canplay', canplayEventListener)
    }
  }, [])

  return (
    <Stack direction={['column', 'row']} boxShadow={'md'} rounded={'md'} py={9} px={6} spacing={6}>
      <AspectRatio ratio={16 / 9} maxW="540px" w="50%" bg="black">
        <Box p={3}>
          <video
            src={src}
            poster={poster}
            ref={videoElement}
            onLoadedMetadata={setDuration}
          />
        </Box>
      </AspectRatio>
      <VStack w="50%" spacing="10px" align="flex-start">
        <Text as="h1" fontWeight={'bold'} fontSize="25px">{shortTitle}</Text>
        <Text decoration={'italic'} fontSize="15px"><i>{title}</i></Text>
        <Text fontSize="15px">
          {description}
        </Text>
      </VStack>
    </Stack>
  );
}

export default VideoPlayer;