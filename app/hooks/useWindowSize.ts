import { throttle } from 'es-toolkit';
import { useEffect, useState } from 'react';

export type WindowSize = {
  innerWidth: number;
  innerHeight: number;
  largeViewportHeight: number;
};

const getLargeViewportHeight = () => {
  if (typeof CSS === 'undefined' || !CSS.supports('height', '100lvh') || !document.body) {
    return window.innerHeight;
  }

  const measuringElement = document.createElement('div');
  measuringElement.style.cssText = [
    'position: fixed',
    'visibility: hidden',
    'pointer-events: none',
    'height: 100lvh',
    'top: 0',
    'left: 0',
  ].join(';');

  document.body.appendChild(measuringElement);
  const largeViewportHeight = measuringElement.getBoundingClientRect().height;
  measuringElement.remove();

  return largeViewportHeight || window.innerHeight;
};

export const getWindowSize = (): WindowSize => ({
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
  largeViewportHeight: getLargeViewportHeight(),
});

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize | null>(null);

  useEffect(() => {
    const onResize = throttle(() => {
      const nextWindowSize = getWindowSize();
      setWindowSize(prevWindowSize =>
        prevWindowSize?.innerWidth !== nextWindowSize.innerWidth ||
        prevWindowSize?.innerHeight !== nextWindowSize.innerHeight ||
        prevWindowSize?.largeViewportHeight !== nextWindowSize.largeViewportHeight
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
