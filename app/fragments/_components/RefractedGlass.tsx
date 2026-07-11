import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { useEffect } from 'react';

const RIB_COUNT = 18;

const RefractedGlassLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zLayer.overlay};
  overflow: hidden;
  pointer-events: none;
  isolation: isolate;
`;

const GlassSection = styled.div`
  --wide-rib-width: 6vw;
  --narrow-rib-width: 12px;

  position: absolute;
  top: 0;
  bottom: 0;
  left: calc((var(--rib-index) + 0.5) * (var(--wide-rib-width) + var(--narrow-rib-width)));
  width: 0;
  overflow: hidden;
  transform: translateX(-50%);
  will-change: width;

  &[data-active='true'] {
    animation: refracted-glass 1200ms cubic-bezier(0.76, 0, 0.24, 1)
      calc(var(--rib-index) * calc(600ms / ${RIB_COUNT}));
  }

  @media (prefers-reduced-motion: reduce) {
    width: 0;
    transition: none;
  }

  @keyframes refracted-glass {
    0% {
      width: 0;
    }

    33% {
      width: calc(var(--wide-rib-width) + var(--narrow-rib-width));
    }

    66% {
      width: calc(var(--wide-rib-width) + var(--narrow-rib-width));
    }

    100% {
      width: 0;
    }
  }
`;

const GlassSectionContents = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: calc(var(--wide-rib-width) + var(--narrow-rib-width));
  transform: translateX(-50%);
`;

const GlassRib = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-color: rgb(255 255 255 / 8%);

  &[data-rib='wide'] {
    width: var(--wide-rib-width);
    backdrop-filter: blur(26px) saturate(105%);
    background-image: linear-gradient(
      90deg,
      transparent 0,
      rgb(0 0 0 / 8%) 45%,
      rgb(0 0 0 / 15%) 88%,
      transparent 100%
    );
  }

  &[data-rib='narrow'] {
    width: var(--narrow-rib-width);
    left: var(--wide-rib-width);
    backdrop-filter: blur(13px) brightness(105%);
    background-image: linear-gradient(
      90deg,
      rgb(255 255 255 / 12%),
      transparent 55%,
      rgb(0 0 0 / 12%)
    );
  }
`;

type RefractedGlassProps = {
  active: boolean;
  onComplete: () => void;
};

export const RefractedGlass = ({ active, onComplete }: RefractedGlassProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (active && prefersReducedMotion) {
      onComplete();
    }
  }, [active, onComplete, prefersReducedMotion]);

  return (
    <RefractedGlassLayer aria-hidden>
      {Array.from({ length: RIB_COUNT }, (_, index) => (
        <GlassSection
          data-active={active}
          key={index}
          onTransitionEnd={index === RIB_COUNT - 1 ? onComplete : undefined}
          style={{
            '--rib-index': index,
          }}
        >
          <GlassSectionContents>
            <GlassRib data-rib="wide" />
            <GlassRib data-rib="narrow" />
          </GlassSectionContents>
        </GlassSection>
      ))}
    </RefractedGlassLayer>
  );
};
