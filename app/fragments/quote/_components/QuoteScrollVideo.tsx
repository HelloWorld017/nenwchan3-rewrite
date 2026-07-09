import reinaVideoUrl from '@/assets/videos/reina.linear.mp4';
import { ScrollVideo } from '@/fragments/_components/ScrollVideo';
import { useWindowSize } from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';

const QuoteScrollVideoWrapper = styled.div`
  width: 100%;
  height: 50lvh;
  margin: 12rem 0 4rem;
  overflow: hidden;
  line-height: 0;
`;

const QuoteScrollVideoPlayer = styled(ScrollVideo)`
  height: 100%;
`;

export const QuoteScrollVideo = () => {
  const windowSize = useWindowSize();
  const viewportHeight = windowSize?.largeViewportHeight ?? 0;
  return (
    <QuoteScrollVideoWrapper>
      <QuoteScrollVideoPlayer src={reinaVideoUrl} playOffset={viewportHeight * 0.1} />
    </QuoteScrollVideoWrapper>
  );
};
