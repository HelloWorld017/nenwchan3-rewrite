import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const VIDEO_FRAME_CALLBACK_TIMEOUT_MS = 100;

type RequestHandle =
  | { type: 'video'; id: number; timeoutId: number; token: number; video: HTMLVideoElement }
  | { type: 'animation'; id: number; token: number };

type VideoFrameCallback = () => void;

export const useVideoFrameCallback = (videoRef: RefObject<HTMLVideoElement | null>) => {
  const requestHandleRef = useRef<RequestHandle | null>(null);
  const requestTokenRef = useRef(0);
  const nextFrameCallbackRef = useRef<VideoFrameCallback | null>(null);

  const cancelFrame = useCallback((token?: number) => {
    const handle = requestHandleRef.current;
    if (handle === null) {
      return false;
    }

    if (token !== undefined && handle.token !== token) {
      return false;
    }

    requestHandleRef.current = null;

    if (handle.type === 'video') {
      handle.video.cancelVideoFrameCallback?.(handle.id);
      window.clearTimeout(handle.timeoutId);
      return true;
    }

    window.cancelAnimationFrame(handle.id);
    return true;
  }, []);

  const updateNextVideoCallback = useCallback(
    (callback: VideoFrameCallback | null) => {
      nextFrameCallbackRef.current = callback;

      if (callback === null) {
        cancelFrame();
        return;
      }

      if (requestHandleRef.current !== null) {
        return;
      }

      const token = requestTokenRef.current + 1;
      requestTokenRef.current = token;

      const runCallback = () => {
        if (!cancelFrame(token)) {
          return;
        }

        const nextFrameCallback = nextFrameCallbackRef.current;
        nextFrameCallbackRef.current = null;
        nextFrameCallback?.();
      };

      const video = videoRef.current;

      if (
        typeof video?.requestVideoFrameCallback === 'function' &&
        typeof video.cancelVideoFrameCallback === 'function'
      ) {
        requestHandleRef.current = {
          type: 'video',
          id: video.requestVideoFrameCallback(runCallback),
          timeoutId: window.setTimeout(runCallback, VIDEO_FRAME_CALLBACK_TIMEOUT_MS),
          token,
          video,
        };
        return;
      }

      requestHandleRef.current = {
        type: 'animation',
        id: window.requestAnimationFrame(runCallback),
        token,
      };
    },
    [cancelFrame, videoRef],
  );

  useEffect(
    () => () => {
      updateNextVideoCallback(null);
    },
    [updateNextVideoCallback],
  );

  return {
    updateNextVideoCallback,
  };
};
