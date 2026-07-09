import ruriVideoUrl from '@/assets/videos/ruri.linear.mp4';
import { ScrollVideo } from '@/fragments/_components/ScrollVideo';
import { useWindowSize } from '@/hooks/useWindowSize';
import { styled } from '@linaria/react';
import { Counter } from './_components/Counter';
import {zLayer} from '@/styles';
import {defineI18n} from '@simplei18n/core';
import {t} from '@simplei18n/core/react';
import {addToFonts} from 'virtual:fontsubsetter';
import {Container} from '../_components/Container';
import {useState} from 'react';

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
`;

const FooterScrollVideoPlayer = styled(ScrollVideo)`
  height: 100%;
`;

const FooterScrollVideo = () => {
  const windowSize = useWindowSize();
  const viewportHeight = windowSize?.largeViewportHeight ?? 0;
  return (
    <FooterScrollVideoWrapper>
      <FooterScrollVideoPlayer
        src={ruriVideoUrl}
        playOffset={viewportHeight * 0.25}
        stopOffset={viewportHeight * 0.25}
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
          <div>
            © 2016 - {date} nenw*
          </div>
          <div>
            <a href="https://github.com/HelloWorld017/helloworld017.github.io">View source</a>
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
    <FooterContentsWrapper>
      0123456789
    </FooterContentsWrapper>
  </>
);
