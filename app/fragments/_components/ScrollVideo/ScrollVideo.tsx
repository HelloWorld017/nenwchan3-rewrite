import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import { useWindowSize } from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ComponentPropsWithoutRef, ReactEventHandler, RefCallback } from 'react';

const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

const ScrollVideoPlayer = styled.video`
  display: block;
  width: 100%;
  object-fit: cover;
  object-position: center;
`;

type ScrollVideoProps = Omit<ComponentPropsWithoutRef<'video'>, 'children'>;

export const ScrollVideo = ({
  muted = true,
  playsInline = true,
  preload = 'auto',
  onLoadedMetadata,
  'aria-hidden': ariaHidden = true,
  ...props
}: ScrollVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const windowSize = useWindowSize();
  const viewportHeight = windowSize?.largeViewportHeight ?? 0;

  const playbackKeyframes = useMemo(
    () => [
      { anchor: 'top' as const, offset: viewportHeight * 0.1, value: 0 },
      { anchor: 'bottom' as const, offset: 0, value: 1 },
    ],
    [viewportHeight],
  );

  const {
    ref: playbackTimelineRef,
    valueRef: playbackValueRef,
    onChange: onPlaybackChange,
  } = useScrollTimeline(playbackKeyframes);

  const setVideoRef: RefCallback<HTMLVideoElement> = useCallback(
    node => {
      videoRef.current = node;
      const playbackCleanup = playbackTimelineRef(node);

      return () => {
        videoRef.current = null;
        playbackCleanup?.();
      };
    },
    [playbackTimelineRef],
  );

  const updateVideoTime = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const time = duration * clampProgress(value);
      video.currentTime = time;
    } catch {
      // Metadata could be unavailable during the first render.
    }
  }, []);

  useEffect(() => {
    updateVideoTime(playbackValueRef.current);
    return onPlaybackChange(updateVideoTime);
  }, [onPlaybackChange, playbackValueRef, updateVideoTime]);

  const handleLoadedMetadata: ReactEventHandler<HTMLVideoElement> = useCallback(
    event => {
      updateVideoTime(playbackValueRef.current);
      onLoadedMetadata?.(event);
    },
    [onLoadedMetadata, playbackValueRef, updateVideoTime],
  );

  return (
    <ScrollVideoPlayer
      {...props}
      ref={setVideoRef}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      aria-hidden={ariaHidden}
      onLoadedMetadata={handleLoadedMetadata}
    />
  );
};
