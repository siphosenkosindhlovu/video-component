import React, { FC, useState, useRef, useEffect, ReactEventHandler, MouseEventHandler } from 'react';
import { Box, AspectRatio, Stack, VStack, Text, IconButton, ButtonGroup, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButtonProps, Flex, HStack } from '@chakra-ui/react'
import { MdPause, MdPlayArrow, MdVolumeUp } from 'react-icons/md'
import { msToHMS } from '../utils/msToHMS';
export interface VideoMetadata {
  src: string;
  poster?: string;
  title: string;
  shortTitle: string;
  description: string;
  startTimeStamp: number;
  endTimeStamp: number;
}

interface MediaControlButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  label: string, Icon: FC
}

const MediaControlButton: FC<MediaControlButtonProps> = ({ label, Icon, ...rest }) => {
  return <IconButton aria-label={label} icon={<Icon />} variant={'ghost'} bgColor="transparent" borderRadius={'99px'} size="md" fontSize={'24px'} {...rest} />
}

const VideoPlayer: FC<VideoMetadata> = ({ src, title, shortTitle, description, startTimeStamp, endTimeStamp, poster }) => {
  const videoElement = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0);
  const [readyToPlay, setReadyToPlay] = useState(false)
  let duration = useRef<number>(null);

  const togglePlayback: MouseEventHandler<HTMLButtonElement> = (): void => {
    setIsPlaying(!isPlaying)
  };

  const handleTimeUpdate: ReactEventHandler<HTMLVideoElement> = (e: React.ChangeEvent<HTMLVideoElement>): void => {
    const currentTime = e.target.currentTime * 1000;
    if (currentTime < startTimeStamp) {
      e.target.currentTime = startTimeStamp / 1000;
      setProgress(startTimeStamp)
      setIsPlaying(false)
    } else if (currentTime >= endTimeStamp) {
      e.target.currentTime = endTimeStamp / 1000;
      setProgress(endTimeStamp)
      setIsPlaying(false)
    } else {
      setProgress(currentTime)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      videoElement.current.play();
    } else {
      videoElement.current.pause();
    }
  }, [isPlaying])

  useEffect(() => {
    if (!(progress >= startTimeStamp && progress < endTimeStamp)) {
      videoElement.current.currentTime = startTimeStamp / 1000;
      setProgress(startTimeStamp)
      setIsPlaying(false)
    }
  }, [progress, startTimeStamp, endTimeStamp])

  useEffect(() => {
    videoElement.current.addEventListener('loadedmetadata', (e) => {
      console.log(videoElement.current.duration)
      duration.current = videoElement.current.duration * 1000
      setProgress(startTimeStamp)
    })
    if (videoElement && videoElement.current.readyState > 0) {
      duration.current = videoElement.current.duration * 1000
      setProgress(startTimeStamp)
    }
  }, [startTimeStamp])


  const handleProgressChange = (time: number): void => {
    if (time < endTimeStamp && time >= startTimeStamp) {
      videoElement.current.currentTime = time / 1000;
      setProgress(time)
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <Stack direction={['column', 'row']} boxShadow={'md'} rounded={'md'} py={9} px={6} spacing={6}>
      <Box w={['100%', null, '50%']} position={'relative'}>
        <AspectRatio ratio={16 / 9} w="100%" bg="black">
          <Box w="100%">
            <video
              src={src}
              poster={poster}
              ref={videoElement}
              onTimeUpdate={handleTimeUpdate}
            />
            <Box position={'absolute'} w={'100%'} bottom={0} bgGradient={'linear(to-t, black, transparent)'} color={'white'}>
              <Flex justify={'space-between'}>
                <HStack spacing={'10px'}>
                  {
                    !isPlaying ?
                      <MediaControlButton label="Play music" Icon={MdPlayArrow} onClick={togglePlayback} /> :
                      <MediaControlButton label="Pause music" Icon={MdPause} onClick={togglePlayback} />
    
                  }
                  <Text>{msToHMS(progress)} / {msToHMS(duration.current)}</Text>
                </HStack>
              </Flex>
              <Box px={3}>
                <Slider aria-label="Progress slider" min={0} max={duration.current} step={1} value={progress} onChange={handleProgressChange}>
                  <SliderTrack backgroundColor={'gray.100'}>
                    <Box position='absolute' width={`${startTimeStamp / duration.current * 100}%`} height="4px" backgroundColor={'gray.600'} zIndex={10} />
                    <Box position='absolute' width={`${(duration.current - endTimeStamp) / duration.current * 100}%`} height="4px" backgroundColor={'gray.600'} zIndex={10} right={0} />
                    <SliderFilledTrack bg={'gray.400'} />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </Box>
          </Box>
        </AspectRatio>
      </Box>
      <VStack w={['100%', null, '50%']} spacing="10px" align="stretch">
        <Text as="h1" fontWeight={'bold'} fontSize="25px">{shortTitle}</Text>
        <Text decoration={'italic'} fontSize="15px"><i>{title}</i></Text>
        <Text fontSize="15px">
          {description}
        </Text>
        <Text align={'right'}>
          {msToHMS(endTimeStamp - startTimeStamp)}
        </Text>
        <Text align={'right'}>
          {msToHMS(startTimeStamp)} - {msToHMS(endTimeStamp)}
        </Text>
      </VStack>
    </Stack>
  );
}

export default VideoPlayer;