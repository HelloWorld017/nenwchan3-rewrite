import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useIsTouchEnabled } from '@/hooks/useIsTouchEnabled';
import {usePrefersReducedMotion} from '@/hooks/usePrefersReducedMotion';
import { IconChevronLeft, IconChevronRight } from '@/icons';
import { zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { useCallback, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefCallback } from 'react';

const getScrollPadding = (element: HTMLElement) => {
  const scrollPaddingLeft = getComputedStyle(element).scrollPaddingLeft;
  const padding = Number.parseFloat(scrollPaddingLeft);
  return Number.isFinite(padding) ? padding : 0;
};

const HorizontalScrollContainerRoot = styled.div`
  --horizontal-scroll-max-padding: 10px;
  --horizontal-scroll-target-outer: calc(
    var(--container-width) + 2 * var(--horizontal-scroll-max-padding)
  );
  --horizontal-scroll-outer: min(100vw, var(--horizontal-scroll-target-outer));
  --horizontal-scroll-inner: min(100vw, var(--container-width));
  --horizontal-scroll-padding-size: calc(
    var(--container-padding) +
      max(0px, var(--horizontal-scroll-outer) - var(--horizontal-scroll-inner)) / 2
  );

  position: relative;
  overflow: clip;
  max-width: var(--container-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
`;

const HorizontalScrollButton = styled.button`
  position: absolute;
  top: 50%;
  z-index: ${zLayer.controls};

  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  font-size: 2.4rem;

  pointer-events: auto;
  border-radius: 999rem;
  background: color-mix(var(--grey-900) 70%, transparent 30%);
  box-shadow: var(--shadow-400);
  transform: translate(0, -50%);
  transition:
    opacity var(--transition-default),
    transform var(--transition-bounce);

  [data-is-touch-enabled='true'] > & {
    display: none;
  }

  &[data-direction='prev'] {
    left: calc(var(--horizontal-scroll-padding-size) / 2);
  }

  &[data-direction='next'] {
    right: calc(var(--horizontal-scroll-padding-size) / 2);
  }

  &[hidden] {
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: translate(0, -50%) scale(0.92);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const HorizontalScrollArea = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-padding-left: var(--horizontal-scroll-padding-size);
  scroll-padding-right: var(--horizontal-scroll-padding-size);
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  margin-left: calc(var(--horizontal-scroll-padding-size) * -1);
  margin-right: calc(var(--horizontal-scroll-padding-size) * -1);
  mask-image: linear-gradient(
    to right,
    transparent 0,
    white var(--horizontal-scroll-padding-size),
    white calc(100% - var(--horizontal-scroll-padding-size)),
    transparent 100%
  );

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HorizontalScrollInner = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  padding-left: var(--horizontal-scroll-padding-size);
  padding-right: var(--horizontal-scroll-padding-size);

  & > :not([data-horizontal-scroll-sentinel='true']) {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;

const HorizontalScrollStartSentinel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 1px;
`;

const HorizontalScrollEndSentinel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
`;

type HorizontalScrollContainerProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
};

export const HorizontalScrollContainer = ({
  children,
  className,
  innerClassName,
}: HorizontalScrollContainerProps) => {
  const isTouchEnabled = useIsTouchEnabled();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scrollAreaElement, setScrollAreaElement] = useState<HTMLDivElement | null>(null);
  const [isStartVisible, setIsStartVisible] = useState(true);
  const [isEndVisible, setIsEndVisible] = useState(true);

  const onScrollAreaRef: RefCallback<HTMLDivElement> = useCallback(
    (node: HTMLDivElement | null) => {
      scrollAreaRef.current = node;
      setScrollAreaElement(node);

      return () => {
        scrollAreaRef.current = null;
        setScrollAreaElement(null);
      };
    },
    [],
  );

  const startSentinelRef = useIntersectionObserver(
    entry => setIsStartVisible(entry.isIntersecting),
    { disabled: !scrollAreaElement, root: scrollAreaElement },
  );

  const endSentinelRef = useIntersectionObserver(entry => setIsEndVisible(entry.isIntersecting), {
    disabled: !scrollAreaElement,
    root: scrollAreaElement,
  });

  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollToItem = useCallback((item: Element) => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) {
      return;
    }

    const padding = getScrollPadding(scrollArea);
    const scrollRect = scrollArea.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    scrollArea.scrollTo({
      left: scrollArea.scrollLeft + itemRect.left - scrollRect.left - padding,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [prefersReducedMotion]);

  const onPrev = useCallback(() => {
    const scrollArea = scrollAreaRef.current;
    const inner = innerRef.current;
    if (!scrollArea || !inner) {
      return;
    }

    const padding = getScrollPadding(scrollArea);
    const contentStart = scrollArea.getBoundingClientRect().left + padding;
    const items = Array.from(inner.children).filter(
      item => item.getAttribute('data-horizontal-scroll-sentinel') !== 'true',
    );

    const target = [...items]
      .reverse()
      .find(item => item.getBoundingClientRect().left < contentStart - 1);

    if (target) {
      scrollToItem(target);
    }
  }, [scrollToItem]);

  const onNext = useCallback(() => {
    const scrollArea = scrollAreaRef.current;
    const inner = innerRef.current;
    if (!scrollArea || !inner) {
      return;
    }

    const padding = getScrollPadding(scrollArea);
    const scrollRect = scrollArea.getBoundingClientRect();
    const contentStart = scrollRect.left + padding;
    const contentEnd = scrollRect.right - padding;
    const items = Array.from(inner.children).filter(
      item => item.getAttribute('data-horizontal-scroll-sentinel') !== 'true',
    );
    const target =
      items.find(item => {
        const itemRect = item.getBoundingClientRect();
        return itemRect.left > contentStart + 1 && itemRect.right > contentEnd + 1;
      }) ?? items.find(item => item.getBoundingClientRect().left > contentStart + 1);

    if (target) {
      scrollToItem(target);
    }
  }, [scrollToItem]);

  return (
    <HorizontalScrollContainerRoot
      className={className}
      data-is-touch-enabled={isTouchEnabled ? 'true' : 'false'}
    >
      <HorizontalScrollButton
        aria-label="Previous items"
        data-direction="prev"
        hidden={isStartVisible}
        onClick={onPrev}
        type="button"
      >
        <IconChevronLeft />
      </HorizontalScrollButton>
      <HorizontalScrollButton
        aria-label="Next items"
        data-direction="next"
        hidden={isEndVisible}
        onClick={onNext}
        type="button"
      >
        <IconChevronRight />
      </HorizontalScrollButton>
      <HorizontalScrollArea ref={onScrollAreaRef}>
        <HorizontalScrollInner ref={innerRef} className={innerClassName}>
          <HorizontalScrollStartSentinel
            data-horizontal-scroll-sentinel="true"
            ref={startSentinelRef}
          />
          {children}
          <HorizontalScrollEndSentinel
            data-horizontal-scroll-sentinel="true"
            ref={endSentinelRef}
          />
        </HorizontalScrollInner>
      </HorizontalScrollArea>
    </HorizontalScrollContainerRoot>
  );
};
