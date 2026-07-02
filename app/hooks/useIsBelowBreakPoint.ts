import {throttle} from "es-toolkit";
import {useEffect, useState} from "react";

export const useIsBelowBreakPoint = (breakpoint: number, initialState = false) => {
  const [isBelow, setIsBelow] = useState(initialState);

  useEffect(() => {
    const onUpdate = throttle(() =>{
      setIsBelow(window.innerWidth < breakpoint)
    }, 50);
    onUpdate();

    window.addEventListener('resize', onUpdate);
    return () => window.removeEventListener('resize', onUpdate);
  }, [breakpoint]);

  return isBelow;
};
