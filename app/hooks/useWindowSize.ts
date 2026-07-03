import { throttle } from 'es-toolkit';
import { useEffect, useState } from 'react';

export type WindowSize = {
  innerWidth: number;
  innerHeight: number;
};

const getWindowSize = (): WindowSize => ({
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
});

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize | null>(null);

  useEffect(() => {
    const onResize = throttle(() => {
      const nextWindowSize = getWindowSize();
      setWindowSize(prevWindowSize =>
        prevWindowSize?.innerWidth !== nextWindowSize.innerWidth ||
        prevWindowSize?.innerHeight !== nextWindowSize.innerHeight
          ? nextWindowSize
          : prevWindowSize,
      );
    }, 50);

    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      onResize.cancel();
    };
  }, []);

  return windowSize;
};
