import React, { FC, useState, useRef, useEffect, ReactEventHandler, MouseEventHandler } from 'react';
import { Box, AspectRatio, Stack, VStack, Text, IconButton, ButtonGroup, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButtonProps, Flex, HStack} from '@chakra-ui/react'
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
  return <IconButton aria-label={label} icon={<Icon />} bgColor="transparent" borderRadius={'99px'} size="sm" {...rest} />
}

const VideoPlayer: FC<VideoMetadata> = ({ src, title, shortTitle, description, startTimeStamp, endTimeStamp, poster }) => {
  const videoElement = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(null);
  const [readyToPlay, setReadyToPlay] = useState(false)

  const togglePlayback: MouseEventHandler<HTMLButtonElement> = (): void => {
    setIsPlaying(!isPlaying)
  };

  useEffect(() => {
    if (!isPlaying) {
      videoElement.current.play();
    } else {
      videoElement.current.pause();
    }
  }, [isPlaying])

  const updateDuration: ReactEventHandler<HTMLVideoElement> = (e: React.ChangeEvent<HTMLVideoElement>): void => {
    setDuration(e.target.duration * 1000)
  }

  const handleTimeUpdate: ReactEventHandler<HTMLVideoElement> = (e: React.ChangeEvent<HTMLVideoElement>): void => {
    const currentTime = videoElement.current.currentTime * 1000;
    if (currentTime < startTimeStamp) {
      videoElement.current.currentTime = startTimeStamp / 1000;
      setProgress(startTimeStamp)
      setIsPlaying(false)
    } else if (currentTime >= endTimeStamp) {
      videoElement.current.currentTime = endTimeStamp / 1000;
      setProgress(endTimeStamp)
      setIsPlaying(false)
    } else {
      setProgress(currentTime)
    }
    console.log(progress)
  }

  const handleProgressChange = (time): void => {
    if (time <= endTimeStamp && time >= startTimeStamp) {
      videoElement.current.currentTime = time / 1000;
      setProgress(time)
    }
  }

  return (
    <Stack direction={['column', 'row']} boxShadow={'md'} rounded={'md'} py={9} px={6} spacing={6}>
      <Box w="50%" position={'relative'}>
        <AspectRatio ratio={16 / 9} w="100%" bg="black">
          <video
            src={src}
            poster={poster}
            ref={videoElement}
            onCanPlay={updateDuration}
            onTimeUpdate={handleTimeUpdate}
          />
        </AspectRatio>
        <Box position={'absolute'} w={'100%'}>
          <Flex justify={'space-between'}>
            <HStack spacing={'10px'}>
              <MediaControlButton label="Play music" Icon={isPlaying ? MdPlayArrow : MdPause} onClick={togglePlayback} />
              <Text>{msToHMS(progress)} {msToHMS(duration)}</Text>
            </HStack>
          </Flex>
          <Box px={3}>
            <Slider aria-label="Progress slider" min={0} max={duration} step={1} value={progress} onChange={handleProgressChange}>
              <SliderTrack backgroundColor={'gray.600'}>
                <Box position='absolute' width={`${startTimeStamp / duration * 100}%`} height="4px" backgroundColor={'gray.100'} zIndex={10} />
                <Box position='absolute' width={`${(duration - endTimeStamp) / duration * 100}%`} height="4px" backgroundColor={'gray.100'} zIndex={10} right={0} />
                <SliderFilledTrack bg={'gray.900'} />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </Box>
      </Box>
      <VStack w="50%" spacing="10px" align="stretch">
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