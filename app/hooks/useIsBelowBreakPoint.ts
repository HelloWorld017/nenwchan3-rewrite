import { useWindowSize } from './useWindowSize';

export const useIsBelowBreakPoint = (breakpoint: number, initialState = false) => {
  const windowSize = useWindowSize();

  return windowSize ? windowSize.innerWidth < breakpoint : initialState;
};
