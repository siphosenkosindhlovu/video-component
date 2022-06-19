import React, { FC, useState, useRef, useEffect, ReactEventHandler, MouseEventHandler } from 'react';
import { Box, AspectRatio, Stack, VStack, Text, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButtonProps, Flex, HStack, Spinner } from '@chakra-ui/react'
import { MdPause, MdPlayArrow } from 'react-icons/md'
import { msToHMS, msToEng } from '../utils/msToHMS';
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
  const [readyToPlay, setReadyToPlay] = useState(true)
  let duration = useRef<number>(null);

  const togglePlayback: MouseEventHandler<HTMLButtonElement> = (): void => {
    if (readyToPlay) {
      setIsPlaying(!isPlaying)
    }
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
    if (isPlaying && videoElement.current.paused) {
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
      setReadyToPlay(true)
    }
  }, [progress, startTimeStamp, endTimeStamp])

  useEffect(() => {
    function handleVideoLoad(){
      duration.current = videoElement.current.duration * 1000
      setProgress(startTimeStamp)
      setReadyToPlay(true)
    }
    videoElement.current.addEventListener('loadedmetadata', (e) => {
      handleVideoLoad()
    })
    if (videoElement && videoElement.current.readyState > 0) {
      handleVideoLoad()
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
      <Box role="group" w={['100%', null, '50%']} position={'relative'}>
        <AspectRatio ratio={16 / 9} w="100%" bg="black">
          <Box w="100%">
            <video
              src={src}
              poster={poster}
              ref={videoElement}
              onTimeUpdate={handleTimeUpdate}
              onWaiting={e => setReadyToPlay(false)}
              onPlaying={e => setReadyToPlay(true)}
              onError={e => console.log({ error: e })}
            />
            <Box opacity={1} _groupHover={{ opacity: 1 }} transition='opacity 0.3s ease' position={'absolute'} w={'100%'} bottom={0} bgGradient={'linear(to-t, black, transparent)'} color={'white'}>
              <Flex justify={'space-between'}>
                <HStack spacing={'10px'}>
                  {
                    readyToPlay ?
                      !isPlaying ?
                        <MediaControlButton label="Play music" Icon={MdPlayArrow} onClick={togglePlayback} /> :
                        <MediaControlButton label="Pause music" Icon={MdPause} onClick={togglePlayback} />
                      :
                      <IconButton aria-label='Loading' bg="transparent" _hover={{ bg: 'transparent' }} disabled color={'white'}>
                        <Spinner size={'md'} />
                      </IconButton>
                  }
                  <Text>{msToHMS(progress - startTimeStamp)} / {msToHMS(endTimeStamp - startTimeStamp)}</Text>
                </HStack>
              </Flex>
              <Box px={3}>
                <Slider aria-label="Progress slider" min={startTimeStamp} max={endTimeStamp} step={1} value={progress} onChange={handleProgressChange}>
                  <SliderTrack backgroundColor={'gray.100'}>
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
          {msToEng(duration.current)}
        </Text>
        <Text align={'right'}>
          {msToHMS(startTimeStamp)} - {msToHMS(endTimeStamp)}
        </Text>
      </VStack>
    </Stack>
  );
}

export default VideoPlayer;