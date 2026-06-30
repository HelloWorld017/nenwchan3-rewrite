import { useCallback } from 'react';
import { useLatestRef } from './useLatestRef';
import type { RefCallback } from 'react';

export const useResizeObserver = (callback: (entry: ResizeObserverEntry) => void) => {
  const callbackRef = useLatestRef(callback);
  const ref: RefCallback<HTMLElement> = useCallback(
    (node: HTMLElement | null) => {
      const observer = new ResizeObserver((entries) => {
        if (!entries || entries.length === 0) {
          return;
        }
        callbackRef.current(entries[0]);
      });

      if (node) {
        observer.observe(node);
        return () => observer.disconnect();
      }

      return undefined;
    },
    [callbackRef],
  );

  return ref;
};
