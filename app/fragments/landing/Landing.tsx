import roofrain from '@/assets/videos/roofrain.mp4';
import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import { useWindowSize } from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';
import { useMemo } from 'react';
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
`;

const LandingVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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
  const { ref, value: progress } = useScrollTimeline({ keyframes });

  return (
    <LandingWrapper ref={ref}>
      <LandingInner style={{ '--scroll-progress': progress }}>
        <LandingVideo src={roofrain} autoPlay muted loop playsInline />
      </LandingInner>
    </LandingWrapper>
  );
};
