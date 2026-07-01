import { throttle } from 'es-toolkit';
import { useMemo, useState } from 'react';
import { useResizeObserver } from './useResizeObserver';

export const useSize = () => {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const onResize = useMemo(
    () =>
      throttle((entry: ResizeObserverEntry) => {
        const [mainFragment] = entry.borderBoxSize;
        if (mainFragment) {
          setSize(prevSize =>
            prevSize?.width !== mainFragment.inlineSize ||
            prevSize?.height !== mainFragment.blockSize
              ? {
                  width: mainFragment.inlineSize,
                  height: mainFragment.blockSize,
                }
              : prevSize,
          );
        }
      }, 50),
    [],
  );

  const resizeRef = useResizeObserver(onResize);
  return [resizeRef, size] as const;
};
