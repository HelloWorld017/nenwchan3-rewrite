import reinaVideoUrl from '@/assets/videos/reina.linear.mp4';
import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import { useWindowSize } from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { RefCallback } from 'react';

const VIDEO_HEIGHT = 0.5;
const PLAYBACK_LERP_FACTOR = 0.02;
const PLAYBACK_SETTLE_THRESHOLD = 0.001;

const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

const ScrollVideoWrapper = styled.div`
  width: 100%;
  height: var(--scroll-video-height, 0px);
  margin: 12rem 0 4rem;
  overflow: hidden;
  line-height: 0;
`;

const ScrollVideoPlayer = styled.video`
  display: block;
  width: 100%;
  height: ${VIDEO_HEIGHT * 100}vh;
  object-fit: cover;
  object-position: center;
`;

export const ScrollVideo = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetPlaybackRef = useRef(0);
  const currentPlaybackRef = useRef(0);
  const playbackFrameRef = useRef<number | null>(null);
  const windowSize = useWindowSize();
  const viewportHeight = windowSize?.innerHeight ?? 0;

  const playbackKeyframes = useMemo(
    () => [
      { anchor: 'top' as const, offset: viewportHeight * 0.1, value: 0 },
      { anchor: 'bottom' as const, offset: 0, value: 1 },
    ],
    [viewportHeight],
  );

  const heightKeyframes = useMemo(
    () => [
      { anchor: 'top' as const, offset: viewportHeight * 0.2, value: 0 },
      { anchor: 'top' as const, offset: viewportHeight * 0.7, value: 1 },
    ],
    [viewportHeight],
  );

  const {
    ref: playbackTimelineRef,
    valueRef: playbackValueRef,
    onChange: onPlaybackChange,
  } = useScrollTimeline(playbackKeyframes);

  const {
    ref: heightTimelineRef,
    valueRef: heightValueRef,
    onChange: onHeightChange,
  } = useScrollTimeline(heightKeyframes);

  const setWrapperRef: RefCallback<HTMLDivElement> = useCallback(
    node => {
      wrapperRef.current = node;
      const playbackCleanup = playbackTimelineRef(node);
      const heightCleanup = heightTimelineRef(node);

      return () => {
        wrapperRef.current = null;
        playbackCleanup?.();
        heightCleanup?.();
      };
    },
    [heightTimelineRef, playbackTimelineRef],
  );

  const videoHeight = viewportHeight * VIDEO_HEIGHT;
  const updateHeight = useCallback(
    (value: number) => {
      wrapperRef.current?.style.setProperty(
        '--scroll-video-height',
        `${videoHeight * clampProgress(value)}px`,
      );
    },
    [videoHeight],
  );

  const seekVideoTime = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      const duration = video.duration;
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      video.currentTime = duration * clampProgress(value);
    } catch {
      // Metadata could be unavailable during the first render
    }
  }, []);

  const startVideoTimeAnimation = useCallback(() => {
    if (playbackFrameRef.current !== null) {
      return;
    }

    const animate = () => {
      playbackFrameRef.current = null;

      const target = targetPlaybackRef.current;
      const current = currentPlaybackRef.current;
      const delta = target - current;
      const next =
        Math.abs(delta) < PLAYBACK_SETTLE_THRESHOLD ? target : current + delta * PLAYBACK_LERP_FACTOR;

      currentPlaybackRef.current = next;
      seekVideoTime(next);

      if (next !== target) {
        playbackFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    playbackFrameRef.current = window.requestAnimationFrame(animate);
  }, [seekVideoTime]);

  const updateVideoTime = useCallback(
    (value: number) => {
      targetPlaybackRef.current = clampProgress(value);
      startVideoTimeAnimation();
    },
    [startVideoTimeAnimation],
  );

  useEffect(() => {
    updateHeight(heightValueRef.current);
    return onHeightChange(updateHeight);
  }, [heightValueRef, onHeightChange, updateHeight]);

  useEffect(() => {
    updateVideoTime(playbackValueRef.current);
    return onPlaybackChange(updateVideoTime);
  }, [onPlaybackChange, playbackValueRef, updateVideoTime]);

  const onLoadedMetadata = useCallback(() => {
    updateVideoTime(playbackValueRef.current);
  }, [playbackValueRef, updateVideoTime]);

  useEffect(
    () => () => {
      if (playbackFrameRef.current !== null) {
        window.cancelAnimationFrame(playbackFrameRef.current);
      }
    },
    [],
  );

  return (
    <ScrollVideoWrapper ref={setWrapperRef}>
      <ScrollVideoPlayer
        ref={videoRef}
        src={reinaVideoUrl}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedMetadata={onLoadedMetadata}
      />
    </ScrollVideoWrapper>
  );
};
