import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import {useWindowSize} from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';
import roofrain from '@/assets/videos/roofrain.mp4';

const LandingWrapper = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
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
  const {
    ref,
    value: progress,
  } = useScrollTimeline([
    { anchor: 'top', edge: 'top', offset: 0, value: 0 },
    { anchor: 'top', edge: 'top', offset: 0.5 * (windowSize?.innerHeight ?? 0), value: 1 },
  ]);

  return (
    <LandingWrapper ref={ref}>
      <LandingInner style={{ '--scroll-progress': progress }}>
        <LandingVideo src={roofrain} autoPlay muted loop />
      </LandingInner>
    </LandingWrapper>
  );
};
