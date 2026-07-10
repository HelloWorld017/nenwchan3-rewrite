import { zLayer } from '@/styles';
import { styled } from '@linaria/react';

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
  width: calc(var(--wide-rib-width) + var(--narrow-rib-width));
  overflow: hidden;
  transform: translateX(-50%);
  animation: refracted-glass-out 0.9s cubic-bezier(0.76, 0, 0.24, 1) var(--rib-delay) forwards;
  will-change: width;

  @keyframes refracted-glass-out {
    from {
      width: calc(var(--wide-rib-width) + var(--narrow-rib-width));
    }

    to {
      width: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    width: 0;
    animation: none;
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
      rgb(0 0 0 / 30%) 88%,
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

export const RefractedGlass = () => (
  <RefractedGlassLayer aria-hidden>
    {Array.from({ length: RIB_COUNT }, (_, index) => (
      <GlassSection
        key={index}
        style={{
          '--rib-delay': `${500 + index * 40}ms`,
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
