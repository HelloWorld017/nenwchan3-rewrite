import IconArrowRight from '@/assets/icons/IconArrowRight.svg?react';
import { useIsTouchEnabled } from '@/hooks/useIsTouchEnabled';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { useEffect, useRef } from 'react';

const POINT_COUNT = 28;
const BASE_RADIUS = 16;
const HOVER_RADIUS = 28;

type Point = {
  angle: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const CursorLayer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: ${zLayer.cursor};
`;

const CursorCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const CursorIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  color: var(--grey-300);
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.72);

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-45deg);
  }
`;

const createPoints = (x: number, y: number, radius: number) =>
  Array.from({ length: POINT_COUNT }, (_, index): Point => {
    const angle = (index / POINT_COUNT) * Math.PI * 2;
    return {
      angle,
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
    };
  });

const drawBlob = (context: CanvasRenderingContext2D, points: Point[]) => {
  context.beginPath();

  for (let index = 0; index < points.length; index++) {
    const previous = points[(index - 1 + points.length) % points.length];
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const nextNext = points[(index + 2) % points.length];

    if (index === 0) {
      context.moveTo(current.x, current.y);
    }

    context.bezierCurveTo(
      current.x + (next.x - previous.x) / 6,
      current.y + (next.y - previous.y) / 6,
      next.x - (nextNext.x - current.x) / 6,
      next.y - (nextNext.y - current.y) / 6,
      next.x,
      next.y,
    );
  }

  context.closePath();
  context.fill();
};

const getInteractiveTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest('a[href], button:not([disabled])');
};

export const Cursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const isTouchEnabled = useIsTouchEnabled();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isTouchEnabled || prefersReducedMotion) {
      return () => {};
    }

    const canvas = canvasRef.current;
    const icon = iconRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !icon || !context) {
      return () => {};
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let hasPointer = false;
    let isInteractive = false;
    let isAnchor = false;
    let cursorOpacity = 0;
    let iconOpacity = 0;
    let radius = BASE_RADIUS;
    let targetX = 0;
    let targetY = 0;
    const center = { x: 0, y: 0, vx: 0, vy: 0 };
    const fillStyle = '#a0a0a0';
    let points: Point[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateInteractiveTarget = (target: EventTarget | null) => {
      const interactiveTarget = getInteractiveTarget(target);
      isAnchor = interactiveTarget?.tagName.toLowerCase() === 'a';
      isInteractive = interactiveTarget !== null;
    };

    const initialize = (x: number, y: number) => {
      targetX = x;
      targetY = y;
      center.x = x;
      center.y = y;
      center.vx = 0;
      center.vy = 0;
      radius = isInteractive ? HOVER_RADIUS : BASE_RADIUS;
      points = createPoints(x, y, radius);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }

      updateInteractiveTarget(event.target);

      if (!hasPointer) {
        initialize(event.clientX, event.clientY);
      }

      hasPointer = true;
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        hasPointer = false;
        isAnchor = false;
        isInteractive = false;
      }
    };

    const onBlur = () => {
      hasPointer = false;
      isAnchor = false;
      isInteractive = false;
    };

    const updatePhysics = () => {
      const targetOpacity = hasPointer ? 0.5 : 0;
      const targetIconOpacity = hasPointer && isAnchor ? 1 : 0;
      const targetRadius = isInteractive ? HOVER_RADIUS : BASE_RADIUS;

      cursorOpacity += (targetOpacity - cursorOpacity) * 0.16;
      iconOpacity += (targetIconOpacity - iconOpacity) * 0.18;
      radius += (targetRadius - radius) * 0.14;

      center.vx += (targetX - center.x) * (isInteractive ? 0.08 : 0.12);
      center.vy += (targetY - center.y) * (isInteractive ? 0.08 : 0.12);
      center.vx *= isInteractive ? 0.74 : 0.68;
      center.vy *= isInteractive ? 0.74 : 0.68;
      center.x += center.vx;
      center.y += center.vy;

      const speed = Math.hypot(center.vx, center.vy);
      const direction = Math.atan2(center.vy, center.vx);
      const stretch = Math.min(speed * (isInteractive ? 0.95 : 0.75), isInteractive ? 38 : 26);
      const stiffness = isInteractive ? 0.08 : 0.12;
      const damping = isInteractive ? 0.58 : 0.5;

      for (const point of points) {
        const alignment = Math.cos(point.angle - direction);
        const trailing = Math.max(0, -alignment);
        const leading = Math.max(0, alignment);
        const stretchOffset = trailing * stretch - leading * stretch * 0.78;
        const dragOffset = trailing * stretch * (isInteractive ? 0.62 : 0.98);
        const pointRadius = Math.max(4, radius + stretchOffset);
        const targetPointX =
          center.x + Math.cos(point.angle) * pointRadius - Math.cos(direction) * dragOffset;
        const targetPointY =
          center.y + Math.sin(point.angle) * pointRadius - Math.sin(direction) * dragOffset;

        point.vx += (targetPointX - point.x) * stiffness;
        point.vy += (targetPointY - point.y) * stiffness;
        point.vx *= damping;
        point.vy *= damping;
        point.x += point.vx;
        point.y += point.vy;
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      if (points.length > 0 && cursorOpacity > 0.01) {
        context.save();
        context.globalAlpha = cursorOpacity * 0.72;
        context.fillStyle = fillStyle;
        drawBlob(context, points);
        context.restore();
      }

      icon.style.opacity = String(iconOpacity);
      icon.style.transform = [
        `translate3d(${center.x}px, ${center.y}px, 0)`,
        'translate(-50%, -50%)',
        `scale(${0.72 + iconOpacity * 0.28})`,
      ].join(' ');
    };

    const animate = () => {
      updatePhysics();
      draw();
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('blur', onBlur);
    window.addEventListener('pointerout', onPointerOut);
    document.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('pointermove', onPointerMove);
    };
  }, [isTouchEnabled, prefersReducedMotion]);

  if (isTouchEnabled || prefersReducedMotion) {
    return null;
  }

  return (
    <CursorLayer aria-hidden>
      <CursorCanvas ref={canvasRef} />
      <CursorIconWrapper ref={iconRef}>
        <IconArrowRight />
      </CursorIconWrapper>
    </CursorLayer>
  );
};
