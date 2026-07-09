import ruriVideoUrl from '@/assets/videos/ruri.mp4';
import { zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { useRef, useState } from 'react';
import { addToFonts } from 'virtual:fontsubsetter';
import { Container } from '../_components/Container';
import { Counter } from './_components/Counter';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMergedRef } from '@/hooks/useMergedRef';

defineI18n(
  yaml => yaml`
    # scope: footer
    counter.description: '번째로 읽어주셔서 감사합니다!'
  `,
);

const FooterScrollVideoWrapper = styled.div`
  width: 100%;
  height: 50lvh;
  overflow: hidden;
  line-height: 0;
  opacity: 0;
  transition: opacity var(--transition-default);

  &[data-is-visible='true'] {
    opacity: 1;
  }
`;

const FooterScrollVideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
`;

const FooterScrollVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const intersectionRef = useIntersectionObserver(entry => {
    if (!isVisible && entry.isIntersecting) {
      setIsVisible(true);
    }

    const video = videoRef.current;
    if (video && video.paused && entry.isIntersecting) {
      video.play();
    }
  }, { threshold: 0.75 });

  const ref = useMergedRef(videoRef, intersectionRef);

  return (
    <FooterScrollVideoWrapper data-is-visible={isVisible}>
      <FooterScrollVideoPlayer
        ref={ref}
        src={ruriVideoUrl}
        muted
        playsInline
        preload="auto"
        aria-hidden={true}
      />
    </FooterScrollVideoWrapper>
  );
};

const FooterCounterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15rem 0;
  padding: 0 var(--container-padding);
`;

const FooterCounterText = styled.span`
  color: var(--grey-400);
  font-family: var(--font-letter);
  font-size: 2rem;
  letter-spacing: -0.01em;
  margin-top: 1.6rem;
  z-index: ${zLayer.base + 1};
`;

const FooterCounter = () => (
  <FooterCounterWrapper>
    <Counter />
    <FooterCounterText>
      <t._>{t.footer.counter.description}</t._>
    </FooterCounterText>
  </FooterCounterWrapper>
);

const FooterContentsWrapper = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: 3rem 0 6rem;
  border-top: 0.14rem solid var(--grey-800);

  color: var(--grey-300);
  font-size: 1.5rem;
  font-weight: 300;
`;

const FooterContents = () => {
  const [date] = useState(() => new Date().getFullYear());
  return (
    <Container>
      <FooterContentsWrapper>
        <div>© 2016 - {date} nenw*</div>
        <div>
          <a href="https://github.com/HelloWorld017/helloworld017.github.io">View Source</a>
        </div>
      </FooterContentsWrapper>
    </Container>
  );
};

export const Footer = () => (
  <section>
    <FooterScrollVideo />
    <FooterCounter />
    <FooterContents />
  </section>
);

addToFonts(
  <>
    <FooterCounterText>
      <t._>{t.footer.counter.description}</t._>
    </FooterCounterText>
    <FooterContents />
    <FooterContentsWrapper>0123456789</FooterContentsWrapper>
  </>,
);
