import ruriVideoUrl from '@/assets/videos/ruri.webm?codecs=vp9:webm,h264:mp4+video&asset';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMergedRef } from '@/hooks/useMergedRef';
import { useVideoFrame } from '@/hooks/useVideoFrame';
import { styled } from '@linaria/react';
import { useCallback, useRef, useState } from 'react';

const LOOP_START = 3.5;
const LOOP_END = 6;
const VIDEO_FRAME_DURATION = 1 / 30;

const FooterVideoWrapper = styled.div`
  width: 100%;
  height: 50lvh;
  overflow: hidden;
  line-height: 0;
  opacity: 0;
  transition: opacity var(--transition-default);

  &[data-is-visible='true'] {
    opacity: 1;
  }
`;

const FooterVideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
`;

export const FooterVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { updateNextVideoCallback } = useVideoFrame(videoRef);
  const intersectionRef = useIntersectionObserver(
    entry => {
      if (!isVisible && entry.isIntersecting) {
        setIsVisible(true);
      }

      const video = videoRef.current;
      if (video && video.paused && entry.isIntersecting) {
        void video.play();
      }
    },
    { threshold: 0.75 },
  );

  const ref = useMergedRef(videoRef, intersectionRef);
  const updateVideoLoop = useCallback(
    function updateVideoLoop(_now: DOMHighResTimeStamp, metadata?: VideoFrameCallbackMetadata) {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      const mediaTime = metadata?.mediaTime ?? video.currentTime;
      if (mediaTime >= LOOP_END - VIDEO_FRAME_DURATION) {
        video.currentTime = LOOP_START;
      }

      if (video.paused || video.ended) {
        void video.play();
      }

      updateNextVideoCallback(updateVideoLoop);
    },
    [updateNextVideoCallback],
  );

  return (
    <FooterVideoWrapper data-is-visible={isVisible}>
      <FooterVideoPlayer
        ref={ref}
        src={ruriVideoUrl.use}
        muted
        playsInline
        preload="auto"
        aria-hidden={true}
        onPlay={() => {
          updateNextVideoCallback(updateVideoLoop);
        }}
        onPause={() => {
          updateNextVideoCallback(null);
        }}
        onEnded={event => {
          event.currentTarget.currentTime = LOOP_START;
          void event.currentTarget.play();
        }}
      />
    </FooterVideoWrapper>
  );
};
