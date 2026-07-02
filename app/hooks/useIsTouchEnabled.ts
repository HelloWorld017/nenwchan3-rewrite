import { useEffect, useState } from 'react';

const getIsTouchEnabled = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return navigator.maxTouchPoints > 0 || window.matchMedia('(any-pointer: coarse)').matches;
};

export const useIsTouchEnabled = () => {
  const [isTouchEnabled, setIsTouchEnabled] = useState(getIsTouchEnabled);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia('(any-pointer: coarse)');
    const update = () => setIsTouchEnabled(getIsTouchEnabled());

    update();
    mediaQueryList.addEventListener('change', update);

    return () => mediaQueryList.removeEventListener('change', update);
  }, []);

  return isTouchEnabled;
};
