import {ScrollVideo} from "@/fragments/_components/ScrollVideo";
import {styled} from "@linaria/react";
import ruriVideoUrl from '@/assets/videos/ruri.linear.mp4';
import {useWindowSize} from "@/hooks/useWindowSize";

const FooterScrollVideoWrapper = styled.div`
  width: 100%;
  height: 50lvh;
  overflow: hidden;
  line-height: 0;
`;

const FooterScrollVideoPlayer = styled(ScrollVideo)`
  height: 100%;
`;

const FooterScrollVideo = () => {
  const windowSize = useWindowSize();
  const viewportHeight = windowSize?.largeViewportHeight ?? 0;
  return (
    <FooterScrollVideoWrapper>
      <FooterScrollVideoPlayer src={ruriVideoUrl} playOffset={viewportHeight * 0.25} stopOffset={viewportHeight * 0.25} />
    </FooterScrollVideoWrapper>
  );
};

const FooterCounterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15rem 0;
`;

const FooterCounter = () => {


  return (
    <FooterCounterWrapper>
    </FooterCounterWrapper>
  );
};

export const Footer = () => (
  <footer>
    <FooterScrollVideo />
  </footer>
);
