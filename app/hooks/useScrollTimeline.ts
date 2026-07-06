import { throttle } from 'es-toolkit';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLatestRef } from './useLatestRef';
import type { RefCallback } from 'react';
import { getWindowSize } from './useWindowSize';
import type { WindowSize } from './useWindowSize';

type ScrollTimelineAnchor = 'top' | 'bottom';
type ScrollTimelineEdge = 'top' | 'bottom';

export type ScrollTimelineKeyframe = {
  anchor: ScrollTimelineAnchor;
  edge?: ScrollTimelineEdge;
  offset: number;
  value: number;
};

type ScrollTimelineListener = (value: number) => void;
type ScrollTimelinePoint = {
  position: number;
  value: number;
};

const getScrollTimelinePoints = (
  element: HTMLElement,
  keyframes: ScrollTimelineKeyframe[],
  windowSize: WindowSize,
): ScrollTimelinePoint[] => {
  if (keyframes.length === 0) {
    return [];
  }

  const rect = element.getBoundingClientRect();
  const scrollY = window.scrollY;
  const top = rect.top + scrollY;
  const bottom = rect.bottom + scrollY;
  return keyframes
    .map(({ anchor, edge = anchor === 'top' ? 'bottom' : 'top', offset, value }) => ({
      position:
        (anchor === 'top' ? top : bottom) + (edge === 'bottom' ? -windowSize.largeViewportHeight : 0) + offset,
      value,
    }))
    .sort((a, b) => a.position - b.position);
};

const getScrollTimelineValue = (points: ScrollTimelinePoint[], scrollY: number) => {
  if (points.length === 0) {
    return 0;
  }

  const [firstPoint] = points;
  if (scrollY <= firstPoint.position) {
    return firstPoint.value;
  }

  const lastPoint = points[points.length - 1];
  if (scrollY >= lastPoint.position) {
    return lastPoint.value;
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    if (scrollY < start.position || scrollY > end.position) {
      continue;
    }

    if (start.position === end.position) {
      return end.value;
    }

    const progress = (scrollY - start.position) / (end.position - start.position);
    return start.value + (end.value - start.value) * progress;
  }

  return lastPoint.value;
};

export const useScrollTimeline = (keyframes: ScrollTimelineKeyframe[]) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const keyframesRef = useLatestRef(keyframes);
  const pointsRef = useRef<ScrollTimelinePoint[]>([]);
  const valueRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const listenersRef = useRef(new Set<ScrollTimelineListener>());
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const setThrottledValue = useMemo(() => throttle(setValue, 50), []);

  const measure = useCallback(() => {
    const currentKeyframes = keyframesRef.current;
    const currentElement = elementRef.current;
    if (!currentElement) {
      pointsRef.current = [];
      return;
    }

    const windowSize = getWindowSize();
    pointsRef.current = getScrollTimelinePoints(currentElement, currentKeyframes, windowSize);
  }, [keyframesRef]);

  const update = useCallback(() => {
    const nextValue = getScrollTimelineValue(pointsRef.current, window.scrollY);
    if (valueRef.current === nextValue) {
      return;
    }

    valueRef.current = nextValue;
    listenersRef.current.forEach(listener => listener(nextValue));
    setThrottledValue(nextValue);
  }, [setThrottledValue]);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      update();
    });
  }, [update]);

  const measureThrottled = useMemo(
    () =>
      throttle(() => {
        measure();
        scheduleUpdate();
      }, 150),
    [measure, scheduleUpdate],
  );

  const ref: RefCallback<HTMLElement> = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;
      setElement(node);
      measure();
      scheduleUpdate();

      return () => {
        elementRef.current = null;
        setElement(null);
        pointsRef.current = [];
      };
    },
    [measure, scheduleUpdate],
  );

  const onChange = useCallback((listener: ScrollTimelineListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    measure();
    scheduleUpdate();
  }, [keyframes, measure, scheduleUpdate]);

  useEffect(() => {
    const onScroll = () => {
      measureThrottled();
      scheduleUpdate();
    };

    const onResize = () => {
      measure();
      scheduleUpdate();
    };

    measure();
    scheduleUpdate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      measureThrottled.cancel();
    };
  }, [measure, measureThrottled, scheduleUpdate]);

  useEffect(() => {
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      measure();
      scheduleUpdate();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, measure, scheduleUpdate]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      setThrottledValue.cancel();
    },
    [setThrottledValue],
  );

  return { ref, value, valueRef, onChange };
};
