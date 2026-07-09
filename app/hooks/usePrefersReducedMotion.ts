import {useEffect, useState} from "react";

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mediaQueryList.matches);

    update();
    mediaQueryList.addEventListener('change', update);
    return () => mediaQueryList.removeEventListener('change', update);
  }, []);

  return prefersReducedMotion;
};
