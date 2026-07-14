import LogoMonochrome from '@/assets/icons/LogoMonochrome.svg?react';
import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import { useWindowSize } from '@/hooks/useWindowSize';
import { breakpoints } from '@/styles';
import { styled } from '@linaria/react';
import { useEffect, useMemo, useRef } from 'react';
import { addToFonts } from 'virtual:fontsubsetter';
import { LandingVideo } from './_components/LandingVideo';
import { ScrollIndicator } from './_components/ScrollIndicator';
import type { ScrollTimelineKeyframe } from '@/hooks/useScrollTimeline';

const LandingWrapper = styled.section`
  position: relative;
  width: 100vw;
  height: 100lvh;
  overflow: hidden;
`;

const LandingInner = styled.div`
  position: absolute;
  inset: calc(((var(--scroll-progress) * 2) - 1) * var(--container-padding));
  border-radius: calc(var(--scroll-progress) * var(--container-padding));
  overflow: hidden;
  background: #202020;

  @media (prefers-reduced-motion: reduce) {
    --scroll-progress: 1 !important;
  }
`;

const LandingContents = styled.div`
  position: absolute;
  inset: 10rem 12rem 18rem 18rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  color: var(--grey-900);

  @media (max-width: ${breakpoints.xl}px) {
    inset: 10rem 12rem 12rem 12rem;
  }

  @media (max-width: ${breakpoints.md}px) {
    inset: 10rem 12rem 12rem 10rem;
  }
`;

const LandingLogo = styled(LogoMonochrome)`
  font-size: clamp(4rem, 8lvmin, 8rem);
  margin-bottom: 6rem;
`;

const LandingText = styled.div`
  font-family: var(--font-display);
  font-size: clamp(4rem, 8lvmin, 8rem);
  font-weight: 700;
  line-height: 1.1em;
  letter-spacing: -0.015em;
`;

const LandingTextLight = styled.span`
  font-weight: 300;
`;

export const Landing = () => {
  const windowSize = useWindowSize();
  const scrollHeight = 0.5 * (windowSize?.largeViewportHeight ?? 0);
  const keyframes = useMemo(
    (): ScrollTimelineKeyframe[] => [
      { anchor: 'top', edge: 'top', offset: 0, value: 0 },
      { anchor: 'top', edge: 'top', offset: scrollHeight, value: 1 },
    ],
    [scrollHeight],
  );

  const { ref, onChange: onScrollChange } = useScrollTimeline({ keyframes });
  const innerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() =>
    onScrollChange(progress => {
      if (innerRef.current) {
        innerRef.current.style.setProperty('--scroll-progress', progress.toFixed(2));
      }
    }),
  );

  return (
    <LandingWrapper ref={ref}>
      <LandingInner ref={innerRef}>
        <LandingVideo />
        <LandingContents>
          <LandingLogo />
          <LandingText>
            Aviation
            <br />
            <LandingTextLight>In Progress</LandingTextLight>
          </LandingText>
          <ScrollIndicator />
        </LandingContents>
      </LandingInner>
    </LandingWrapper>
  );
};

addToFonts(<Landing />);
