import reinaVideoUrl from '@/assets/videos/reina.linear.mp4';
import { ScrollVideo } from '@/fragments/_components/ScrollVideo';
import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import { useWindowSize } from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { RefCallback } from 'react';

const VIDEO_HEIGHT = 0.5;

const QuoteScrollVideoWrapper = styled.div`
  width: 100%;
  height: var(--quote-scroll-video-height, 0px);
  margin: 12rem 0 4rem;
  overflow: hidden;
  line-height: 0;
  transition: opacity var(--transition-default);

  @media (prefers-reduced-motion: reduce) {
    height: ${VIDEO_HEIGHT * 100}lvh;
    transition: none;
  }
`;

const QuoteScrollVideoPlayer = styled(ScrollVideo)`
  height: ${VIDEO_HEIGHT * 100}lvh;
`;

export const QuoteScrollVideo = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const windowSize = useWindowSize();
  const viewportHeight = windowSize?.largeViewportHeight ?? 0;

  const heightKeyframes = useMemo(
    () => [
      { anchor: 'top' as const, offset: 0, value: 0.4 },
      { anchor: 'top' as const, offset: viewportHeight * 0.7, value: 1 },
    ],
    [viewportHeight],
  );

  const { ref: heightTimelineRef, onChange: onHeightChange } = useScrollTimeline({
    keyframes: heightKeyframes,
    interpolate: false,
  });

  const setWrapperRef: RefCallback<HTMLDivElement> = useCallback(
    node => {
      wrapperRef.current = node;
      const heightCleanup = heightTimelineRef(node);

      return () => {
        wrapperRef.current = null;
        heightCleanup?.();
      };
    },
    [heightTimelineRef],
  );

  const videoHeight = viewportHeight * VIDEO_HEIGHT;
  const updateHeight = useCallback(
    (value: number) => {
      wrapperRef.current?.style.setProperty(
        '--quote-scroll-video-height',
        `${videoHeight * value}px`,
      );
    },
    [videoHeight],
  );

  useEffect(() => onHeightChange(updateHeight), [onHeightChange, updateHeight]);

  return (
    <QuoteScrollVideoWrapper ref={setWrapperRef}>
      <QuoteScrollVideoPlayer src={reinaVideoUrl} playOffset={viewportHeight * 0.1} />
    </QuoteScrollVideoWrapper>
  );
};
