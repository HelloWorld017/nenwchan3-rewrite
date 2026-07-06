import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import { useWindowSize } from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useVideoFrameCallback } from './_hooks/useVideoFrameCallback';
import type { ComponentPropsWithoutRef, ReactEventHandler, RefCallback } from 'react';

const PLAYBACK_LERP_FACTOR = 0.18;
const PLAYBACK_SETTLE_THRESHOLD = 0.001;

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
  const targetPlaybackRef = useRef(0);
  const currentPlaybackRef = useRef(0);
  const { updateNextVideoCallback } = useVideoFrameCallback(videoRef);

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
  } = useScrollTimeline({ keyframes: playbackKeyframes, interpolate: false });

  const setVideoRef: RefCallback<HTMLVideoElement> = useCallback(
    node => {
      videoRef.current = node;
      const playbackCleanup = playbackTimelineRef(node);

      return () => {
        updateNextVideoCallback(null);
        videoRef.current = null;
        playbackCleanup?.();
      };
    },
    [playbackTimelineRef, updateNextVideoCallback],
  );

  const seekVideoTime = useCallback((value: number) => {
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

  const startVideoTimeAnimation = useCallback(() => {
    const animate = () => {
      const target = targetPlaybackRef.current;
      const current = currentPlaybackRef.current;
      const delta = target - current;
      const next =
        Math.abs(delta) < PLAYBACK_SETTLE_THRESHOLD
          ? target
          : current + delta * PLAYBACK_LERP_FACTOR;

      currentPlaybackRef.current = next;
      seekVideoTime(next);

      if (next !== target) {
        updateNextVideoCallback(animate);
      }
    };

    updateNextVideoCallback(animate);
  }, [seekVideoTime, updateNextVideoCallback]);

  const updateVideoTime = useCallback(
    (value: number) => {
      targetPlaybackRef.current = clampProgress(value);
      startVideoTimeAnimation();
    },
    [startVideoTimeAnimation],
  );

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
