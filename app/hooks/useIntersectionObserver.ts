import { useCallback } from 'react';
import { useLatestRef } from './useLatestRef';
import type { RefCallback } from 'react';

type UseIntersectionObserverOptions = IntersectionObserverInit & {
  disabled?: boolean;
};

export const useIntersectionObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  { disabled = false, root = null, rootMargin, threshold }: UseIntersectionObserverOptions = {},
) => {
  const callbackRef = useLatestRef(callback);

  const ref: RefCallback<HTMLElement> = useCallback(
    (node: HTMLElement | null) => {
      if (!node || disabled) {
        return undefined;
      }

      const observer = new IntersectionObserver(
        entries => {
          const [entry] = entries;
          if (entry) {
            callbackRef.current(entry);
          }
        },
        { root, rootMargin, threshold },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [callbackRef, disabled, root, rootMargin, threshold],
  );

  return ref;
};
