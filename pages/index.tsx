import VideoPlayer, { VideoMetadata } from '../components/video-player';
import { Container } from '@chakra-ui/react';
export default function Home() {

  const videoObj: VideoMetadata = {
    src: 'https://ia800706.us.archive.org/9/items/2013_DEFCON_Documentary/2013_DEFCON_Documentary.HD.mp4',
    title: 'After the first def Con. He wanted to change it and start doing it again, but his friends convinced him',
    description: `After the first Def Con, he wanted to change it and start
    doing it again. He didn’t want to go to the first one, but his friends convinced
    him Defcon One was around 100 people and they expect roughly 15000 for
    Def Con next year. This year’s Def Con is going to be a special one. Last
    year there were 100 people on the line and this year there will be near that
    many people registered. There is a difference between driving and flying to
    Def Con. The barbecue is this misfit lovechild of Def Con because everyone’s
    excited about going to a barbecue 6 miles away from the Con. It’s the 20th
    year of Defcon a hacking conference. It’s in Las Vegas. Steve, Jeffs, Chris’s,
    Bills and Bills’ group is going to the conference. This is Steve’s first time
    attending Defcon. Steve is a teacher. Steve and his group are going to talk
    about Defcon and get their badge`,
    shortTitle: 'How did Defcon idea originate?',
    startTimeStamp: 152000,
    endTimeStamp: 215000
  }

  return (
    <Container maxW="container.xl">
      <h1>Mike check</h1>
      <VideoPlayer {...videoObj} />
    </Container>
  )
}
