import { useCallback, useEffect, useRef } from 'react';

type AnimationFrameCallback = () => void;

export const useAnimationFrame = () => {
  const requestHandleRef = useRef<number | null>(null);
  const nextAnimationCallbackRef = useRef<AnimationFrameCallback | null>(null);

  const cancelFrame = useCallback(() => {
    const handle = requestHandleRef.current;
    if (handle === null) {
      return false;
    }

    requestHandleRef.current = null;
    window.cancelAnimationFrame(handle);
    return true;
  }, []);

  const updateNextAnimationCallback = useCallback(
    (callback: AnimationFrameCallback | null) => {
      nextAnimationCallbackRef.current = callback;

      if (callback === null) {
        cancelFrame();
        return;
      }

      if (requestHandleRef.current !== null) {
        return;
      }

      requestHandleRef.current = window.requestAnimationFrame(() => {
        requestHandleRef.current = null;

        const nextAnimationCallback = nextAnimationCallbackRef.current;
        nextAnimationCallbackRef.current = null;
        nextAnimationCallback?.();
      });
    },
    [cancelFrame],
  );

  useEffect(
    () => () => {
      updateNextAnimationCallback(null);
    },
    [updateNextAnimationCallback],
  );

  return { updateNextAnimationCallback };
};
