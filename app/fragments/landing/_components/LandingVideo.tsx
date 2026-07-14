import hizashiVideoUrl from '@/assets/videos/hizashi.webm?codecs=vp9:webm,h264:mp4+video';
import manabiVideoUrl from '@/assets/videos/manabi.webm?codecs=vp9:webm,h264:mp4+video';
import roofrainVideoAsset from '@/assets/videos/roofrain.mp4?asset';
import { breakpoints } from '@/styles';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefCallback, TransitionEvent } from 'react';

const TRANSITION_DURATION_SECONDS = 2;

type LandingVideoData = {
  key: string;
  description: string;
  use: () => string;
  origin: string;
  loop: number;
};

const videos = [
  {
    key: 'roofrain',
    description: '雨が降る屋上 | 2024. 11. 18 | nenw*',
    use: () => roofrainVideoAsset.use,
    origin: '34% 70%',
    loop: 4,
  },
  {
    key: 'manabi',
    description: '卒業式 | 2021. 07. 03 | nenw*',
    use: () => manabiVideoUrl,
    origin: '50% 50%',
    loop: 1,
  },
  {
    key: 'hizashi',
    description: '日差し | 2025. 04. 21 | nenw*',
    use: () => hizashiVideoUrl,
    origin: '50% 50%',
    loop: 4,
  },
] satisfies readonly LandingVideoData[];

const LandingVideoLayer = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity ${TRANSITION_DURATION_SECONDS}s ease;

  &[data-current='true'] {
    opacity: 1;
  }
`;

const LandingVideoPlayer = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LandingVideoInfo = styled.div`
  position: absolute;
  top: 10.5rem;
  right: 12rem;
  color: var(--grey-900);
  font-size: 1.6rem;
  opacity: 0.75;

  @media (max-width: ${breakpoints.md}px) {
    right: 6.5rem;
  }
`;

export const LandingVideo = () => {
  const resolvedVideos = videos.map(video => ({ ...video, src: video.use() }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const nextVideoRef = useRef<HTMLVideoElement | null>(null);
  const isNextVideoReadyRef = useRef(false);
  const completedLoopsRef = useRef(0);
  const previousTimeRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const currentVideo = resolvedVideos[currentIndex];
  const nextIndex = (currentIndex + 1) % resolvedVideos.length;
  const hasNextVideo = nextIndex !== currentIndex;
  const renderedIndexes = Array.from(
    new Set([
      ...(outgoingIndex === null ? [] : [outgoingIndex]),
      currentIndex,
      ...(hasNextVideo ? [nextIndex] : []),
    ]),
  );

  useEffect(() => {
    completedLoopsRef.current = 0;
    previousTimeRef.current = 0;
    isTransitioningRef.current = false;
  }, [currentIndex]);

  const setNextVideoRef: RefCallback<HTMLVideoElement> = useCallback(node => {
    if (!node) {
      nextVideoRef.current = null;
      isNextVideoReadyRef.current = false;
      return;
    }

    nextVideoRef.current = node;
    isNextVideoReadyRef.current = node.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA;
    node.pause();
    node.currentTime = 0;
  }, []);

  const playVideoFromStart = (video: HTMLVideoElement) => {
    video.currentTime = 0;
    void video.play();
  };

  const transitionToNextVideo = () => {
    const nextVideoPlayer = nextVideoRef.current;
    if (
      isTransitioningRef.current ||
      !hasNextVideo ||
      !nextVideoPlayer ||
      !isNextVideoReadyRef.current
    ) {
      return;
    }

    isTransitioningRef.current = true;
    playVideoFromStart(nextVideoPlayer);
    setOutgoingIndex(currentIndex);
    setCurrentIndex(nextIndex);
  };

  const handleTimeUpdate = (video: HTMLVideoElement) => {
    const currentTime = video.currentTime;
    if (currentTime < previousTimeRef.current) {
      completedLoopsRef.current += 1;
    }

    previousTimeRef.current = currentTime;

    const elapsedTime = video.duration * completedLoopsRef.current + currentTime;

    if (
      Number.isFinite(video.duration) &&
      video.duration * currentVideo.loop - elapsedTime <= TRANSITION_DURATION_SECONDS
    ) {
      transitionToNextVideo();
    }
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setOutgoingIndex(null);
    }
  };

  return (
    <>
      {renderedIndexes.map(index => {
        const video = resolvedVideos[index];
        const isCurrent = index === currentIndex;
        const isOutgoing = index === outgoingIndex;
        const isNext = index === nextIndex && !isCurrent && !isOutgoing;

        return (
          <LandingVideoLayer
            key={video.key}
            data-current={isCurrent}
            onTransitionEnd={isOutgoing ? handleTransitionEnd : undefined}
          >
            <LandingVideoPlayer
              ref={isNext ? setNextVideoRef : undefined}
              src={video.src}
              style={{ objectPosition: video.origin }}
              autoPlay={isCurrent}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden={true}
              onTimeUpdate={isCurrent ? event => handleTimeUpdate(event.currentTarget) : undefined}
              onCanPlayThrough={
                isNext
                  ? () => {
                      isNextVideoReadyRef.current = true;
                    }
                  : undefined
              }
            />
            <LandingVideoInfo>{video.description}</LandingVideoInfo>
          </LandingVideoLayer>
        );
      })}
    </>
  );
};
