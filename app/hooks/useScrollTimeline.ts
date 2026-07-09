import { throttle } from 'es-toolkit';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimationFrame } from './useAnimationFrame';
import { useLatestRef } from './useLatestRef';
import { getWindowSize } from './useWindowSize';
import type { WindowSize } from './useWindowSize';
import type { RefCallback } from 'react';

const INTERPOLATION_LERP_FACTOR = 0.18;
const INTERPOLATION_SETTLE_THRESHOLD = 0.001;

type ScrollTimelineAnchor = 'top' | 'bottom';
type ScrollTimelineEdge = 'top' | 'bottom';

export type ScrollTimelineKeyframe = {
  anchor: ScrollTimelineAnchor;
  edge?: ScrollTimelineEdge;
  offset: number;
  value: number;
};

type UseScrollTimelineOptions = {
  keyframes: ScrollTimelineKeyframe[];
  interpolate?: boolean;
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
        (anchor === 'top' ? top : bottom) +
        (edge === 'bottom' ? -windowSize.largeViewportHeight : 0) +
        offset,
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

export const useScrollTimeline = ({ keyframes, interpolate = true }: UseScrollTimelineOptions) => {
  const isInitializedRef = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const keyframesRef = useLatestRef(keyframes);
  const interpolateRef = useLatestRef(interpolate);
  const pointsRef = useRef<ScrollTimelinePoint[]>([]);
  const listenersRef = useRef(new Set<ScrollTimelineListener>());

  const [value, setValue] = useState(0);
  const valueRef = useRef(0);
  const targetValueRef = useRef(0);
  const setThrottledValue = useMemo(() => throttle(setValue, 50), []);
  useEffect(() => () => setThrottledValue.cancel(), [setThrottledValue]);

  const { updateNextAnimationCallback: updateNextTargetCallback } = useAnimationFrame();
  const { updateNextAnimationCallback: updateNextInterpolationCallback } = useAnimationFrame();

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

  const commitValue = useCallback(
    (nextValue: number) => {
      const isInitialized = isInitializedRef.current;
      if (isInitialized && valueRef.current === nextValue) {
        return;
      }

      isInitializedRef.current = true;
      valueRef.current = nextValue;
      listenersRef.current.forEach(listener => listener(nextValue));
      setThrottledValue(nextValue);
    },
    [setThrottledValue],
  );

  const animateInterpolation = useCallback(
    function animate() {
      const targetValue = targetValueRef.current;
      const currentValue = valueRef.current;
      const delta = targetValue - currentValue;
      const nextValue =
        Math.abs(delta) < INTERPOLATION_SETTLE_THRESHOLD
          ? targetValue
          : currentValue + delta * INTERPOLATION_LERP_FACTOR;

      commitValue(nextValue);

      if (nextValue !== targetValue) {
        updateNextInterpolationCallback(animate);
      }
    },
    [commitValue, updateNextInterpolationCallback],
  );

  const update = useCallback(() => {
    const nextTargetValue = getScrollTimelineValue(pointsRef.current, window.scrollY);
    targetValueRef.current = nextTargetValue;

    if (!isInitializedRef.current || !interpolateRef.current) {
      updateNextInterpolationCallback(null);
      commitValue(nextTargetValue);
      return;
    }

    if (valueRef.current !== nextTargetValue) {
      updateNextInterpolationCallback(animateInterpolation);
    }
  }, [animateInterpolation, commitValue, interpolateRef, updateNextInterpolationCallback]);

  const scheduleUpdate = useCallback(() => {
    updateNextTargetCallback(update);
  }, [update, updateNextTargetCallback]);

  const ref: RefCallback<HTMLElement> = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        elementRef.current = null;
        pointsRef.current = [];
        return undefined;
      }

      elementRef.current = node;
      measure();
      scheduleUpdate();

      const observer = new ResizeObserver(() => {
        measure();
        scheduleUpdate();
      });

      observer.observe(node);

      return () => {
        observer.disconnect();

        if (elementRef.current === node) {
          elementRef.current = null;
          pointsRef.current = [];
        }
      };
    },
    [measure, scheduleUpdate],
  );

  const onChange = useCallback((listener: ScrollTimelineListener) => {
    listener(valueRef.current);
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    measure();
    scheduleUpdate();
  }, [interpolate, keyframes, measure, scheduleUpdate]);

  useEffect(() => {
    const measureThrottled = throttle(() => {
      measure();
      scheduleUpdate();
    }, 150);

    const onUpdate = () => {
      measureThrottled();
      scheduleUpdate();
    };

    window.addEventListener('scroll', onUpdate, { passive: true });
    window.addEventListener('resize', onUpdate);

    return () => {
      window.removeEventListener('scroll', onUpdate);
      window.removeEventListener('resize', onUpdate);
      measureThrottled.cancel();
    };
  }, [measure, scheduleUpdate]);

  return { ref, value, valueRef, onChange };
};
