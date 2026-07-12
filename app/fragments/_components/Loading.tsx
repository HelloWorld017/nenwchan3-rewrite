import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { useEffect, useRef } from 'react';
import { addToFonts } from 'virtual:fontsubsetter';

type Bubble = {
  acceleration: number;
  finishY: number;
  radius: number;
  size: number;
  speed: number;
  x: number;
  y: number;
};

const LoadingLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zLayer.overlay - 1};
  overflow: hidden;
  opacity: 1;
  pointer-events: auto;
  background: white;
  transition: opacity 800ms ease 800ms;

  &[data-complete='true'] {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const LoadingProgress = styled.progress`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
`;

const LoadingText = styled.div`
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translate(-50%);

  color: var(--bluegrey-700);
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const Water = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(to bottom, var(--bluegrey-800), var(--grey-900));
  transition:
    opacity 400ms ease 400ms,
    height 2s ease;
  will-change: height;

  [data-complete='true'] > & {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const BubbleCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity var(--transition-default);

  &[data-complete='true'] {
    opacity: 0;
  }
`;

const WaterWave = styled.div`
  position: absolute;
  top: 1px;
  width: 200%;
  transform: translateY(-100%);

  &[data-wave='back'] {
    right: 0;
    animation: wave-back 1.4s infinite linear;
  }

  &[data-wave='front'] {
    left: 0;
    animation: wave-front 0.7s infinite linear;
  }

  @keyframes wave-back {
    to {
      transform: translate(50%, -100%);
    }
  }

  @keyframes wave-front {
    to {
      transform: translate(-50%, -100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Wave = styled.svg`
  display: block;
  width: 100%;

  [data-wave='back'] & {
    fill: var(--grey-800);
  }

  [data-wave='front'] & {
    fill: var(--bluegrey-800);
  }
`;

const WaveContents = () => (
  <>
    <path d="M420 20c21.5-.4 38.8-2.5 51.1-4.5 13.4-2.2 26.5-5.2 27.3-5.4C514 6.5 518 4.7 528.5 2.7 535.6 1.4 546.4-.1 560 0v20z" />
    <path d="M420 20c-21.5-.4-38.8-2.5-51.1-4.5-13.4-2.2-26.5-5.2-27.3-5.4C326 6.5 322 4.7 311.5 2.7 304.3 1.4 293.6-.1 280 0v20z" />
    <path d="M140 20c21.5-.4 38.8-2.5 51.1-4.5 13.4-2.2 26.5-5.2 27.3-5.4C234 6.5 238 4.7 248.5 2.7 255.6 1.4 266.4-.1 280 0v20z" />
    <path d="M140 20c-21.5-.4-38.8-2.5-51.1-4.5-13.4-2.2-26.5-5.2-27.3-5.4C46 6.5 42 4.7 31.5 2.7 24.3 1.4 13.6-.1 0 0v20z" />
  </>
);

type LoadingProps = {
  complete: boolean;
  percent: number;
};

export const Loading = ({ complete, percent }: LoadingProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return () => {};
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return () => {};
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let bubbles: Bubble[] = [];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      animationFrame = window.requestAnimationFrame(render);

      context.clearRect(0, 0, width, height);

      bubbles = bubbles.filter(bubble => {
        bubble.speed += bubble.acceleration;
        bubble.y += bubble.speed;
        if (bubble.y >= bubble.finishY) {
          return false;
        }

        context.globalAlpha = Math.min(1, Math.abs(bubble.y - bubble.finishY) / 200);
        context.strokeStyle = '#c9dbef';
        context.lineWidth = bubble.size;
        context.beginPath();
        context.arc(bubble.x, height - bubble.y, bubble.radius, 0, Math.PI * 2);
        context.stroke();
        return true;
      });

      context.globalAlpha = 1;

      if (width > 0 && height > 0) {
        bubbles.push({
          acceleration: 3 + Math.random(),
          finishY: height * (Math.random() / 2 + 0.5),
          radius: (Math.random() / 2 + 0.5) * 5,
          size: Math.random() * 4 + 1,
          speed: 0,
          x: Math.random() * width,
          y: 0,
        });
      }
    };

    render();
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion]);

  const roundedPercent = Math.round(percent);

  return (
    <LoadingLayer data-complete={complete ? 'true' : 'false'}>
      <LoadingProgress aria-label="Loading" max={100} value={roundedPercent} />
      <Water style={{ height: `${roundedPercent}%` }}>
        <BubbleCanvas
          aria-hidden
          data-complete={roundedPercent === 100 ? 'true' : 'false'}
          ref={canvasRef}
        />
        <WaterWave aria-hidden data-wave="back">
          <Wave viewBox="0 0 560 20">
            <WaveContents />
          </Wave>
        </WaterWave>
        <WaterWave aria-hidden data-wave="front">
          <Wave viewBox="0 0 560 20">
            <WaveContents />
          </Wave>
        </WaterWave>
      </Water>
      <LoadingText>Loading {roundedPercent}%</LoadingText>
    </LoadingLayer>
  );
};

addToFonts(<LoadingText>Loading 0123456789%</LoadingText>);
