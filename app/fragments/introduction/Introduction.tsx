import EmojiSparkles from '@/assets/icons/EmojiSparkles.svg?react';
import { Container } from '@/fragments/_components/Container';
import { useIsIntersecting } from '@/hooks/useIntersectionObserver';
import { breakpoints } from '@/styles';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { addToFonts } from 'virtual:fontsubsetter';
import type { ReactNode } from 'react';

defineI18n(
  yaml => yaml`
    # scope: introduction
    developer:
      description: |
        저는 개발에 관심과 열정이 많은 개발자입니다.
        <b>프론트엔드 / 백엔드 개발</b>부터 <b>게임 개발, 머신러닝, 데브옵스, 프로그래밍 언어</b>
        등 정말 다양한 분야에 관심을 가지고 있습니다.

    enthusiast:
      description: |
        또한 저는 누군가에 기억에 남을 무언가를 만들기 위해서
        <b>웹 디자인, 3D 모델링 및 아트, 인쇄물 디자인, 사운드 디자인</b>
        등의 다양한 분야에 관심을 가지고 도전하고 있습니다.
  `,
);

const Bold = styled.b`
  font-weight: 500;
`;

const IntroductionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  flex: 1 1 0;
  padding: 7.2rem 4.8rem;
  border-radius: 2rem;
  box-shadow: var(--shadow-400);
  opacity: 0;
  transform: translate(0, 10rem);
  transition:
    transform var(--transition-default),
    opacity var(--transition-default);

  &[data-is-intersecting='true'] {
    transform: translate(0, 0);
    opacity: 1;
  }

  @media (max-width: ${breakpoints.md}px) {
    padding: 5.4rem 3.6rem;
  }
`;

const IntroductionTitlePrefix = styled.span`
  display: block;
  font-weight: 300;
  font-size: 2.4rem;
`;

const IntroductionTitleWrapper = styled.h2`
  color: var(--grey-900);
  font-size: 3.6rem;
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1em;
  text-transform: uppercase;
`;

const IntroductionTitle = ({
  children,
}: {
  children: { [K in 'prefix' | 'content']: ReactNode };
}) => (
  <IntroductionTitleWrapper>
    <IntroductionTitlePrefix>{children.prefix}</IntroductionTitlePrefix>
    {children.content}
  </IntroductionTitleWrapper>
);

const IntroductionDecorator = styled.figure`
  margin: 0;
  margin-top: 2.4rem;
  margin-bottom: 4.8rem;
  align-self: stretch;
`;

const IntroductionDescription = styled.p`
  max-width: 85rem;
  margin: 0;

  color: var(--grey-900);
  opacity: 0.8;
  font-size: 2rem;
  line-height: 1.6em;
  word-break: keep-all;
`;

const DeveloperCard = styled(IntroductionCard)`
  background: linear-gradient(166deg, #6eac80 0%, #537b7b 100%);
`;

const DeveloperCodeWrapper = styled.div`
  width: 100%;
  container-type: inline-size;
`;

const DeveloperCodeBlock = styled.code`
  display: inline-block;

  margin-top: 2rem;
  margin-bottom: 4rem;
  padding: 2.4rem;

  background: color-mix(var(--grey-200) 70%, transparent 30%);
  border-radius: 1rem;
  color: var(--grey-900);
  font-family: var(--font-code);
  font-size: 2rem;
  line-height: 2.8rem;
  white-space: nowrap;

  @media (max-width: ${breakpoints.xl}px) {
    font-size: 1.8rem;
  }
`;

const SyntaxString = styled.span`
  color: var(--syntax-scheme-0);
`;

const SyntaxObject = styled.span`
  color: var(--syntax-scheme-1);
`;

const BreakAndIndent = styled.div`
  display: block;
  padding-left: 2ch;

  @container (width > 40rem) {
    display: inline;
    padding-left: unset;
  }
`;

const DeveloperCode = () => (
  <DeveloperCodeWrapper>
    <DeveloperCodeBlock>
      <SyntaxObject>console</SyntaxObject>.log(
      <BreakAndIndent>
        <SyntaxString>`Aviation in progress`</SyntaxString>
      </BreakAndIndent>
      );
    </DeveloperCodeBlock>
  </DeveloperCodeWrapper>
);

const Developer = () => {
  const [isIntersecting, ref] = useIsIntersecting({ rootMargin: '30% 0px -30%', threshold: 0 });
  return (
    <div ref={ref}>
      <DeveloperCard data-is-intersecting={isIntersecting}>
        <IntroductionTitle>{{ prefix: 'I am a ', content: 'developer' }}</IntroductionTitle>
        <IntroductionDecorator>
          <DeveloperCode />
        </IntroductionDecorator>
        <IntroductionDescription>
          <t._ $tags={{ b: Bold }}>{t.introduction.developer.description}</t._>
        </IntroductionDescription>
      </DeveloperCard>
    </div>
  );
};

const EnthusiastCard = styled(IntroductionCard)`
  background: linear-gradient(166deg, #56717d 0%, #45475e 100%);
`;

const EnthusiastStars = styled(EmojiSparkles)`
  font-size: 6rem;
`;

const Enthusiast = () => {
  const [isIntersecting, ref] = useIsIntersecting({ rootMargin: '30% 0px -30%', threshold: 0 });

  return (
    <div ref={ref}>
      <EnthusiastCard data-is-intersecting={isIntersecting}>
        <IntroductionTitle>{{ prefix: 'Also I am a ', content: 'enthusiast' }}</IntroductionTitle>
        <IntroductionDecorator>
          <EnthusiastStars />
        </IntroductionDecorator>
        <IntroductionDescription>
          <t._ $tags={{ b: Bold }}>{t.introduction.enthusiast.description}</t._>
        </IntroductionDescription>
      </EnthusiastCard>
    </div>
  );
};

const IntroductionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, auto);
  padding-top: 15rem;
  max-width: 1100px;
  margin: 0 auto;
  gap: 3rem;

  & > * {
    min-height: 42rem;

    &:nth-of-type(1) {
      grid-column: 1 / span 3;
      grid-row: 1 / span 3;
    }

    &:nth-of-type(2) {
      grid-column: 4 / span 3;
      grid-row: 3 / span 3;
    }
  }

  @media (max-width: ${breakpoints.lg}px) {
    grid-template-rows: repeat(6, auto);

    & > * {
      &:nth-of-type(1) {
        grid-column: 1 / span 4;
        grid-row: 1 / span 3;
      }

      &:nth-of-type(2) {
        grid-column: 3 / span 4;
        grid-row: 4 / span 3;
      }
    }
  }

  @media (max-width: ${breakpoints.md}px) {
    grid-template-columns: 1fr;
    gap: 1rem;

    & > * {
      &:nth-of-type(1) {
        grid-column: 1;
        grid-row: 1 / span 3;
      }

      &:nth-of-type(2) {
        grid-column: 1;
        grid-row: 4 / span 3;
      }
    }
  }
`;

export const Introduction = () => (
  <section>
    <Container>
      <IntroductionWrapper>
        <Developer />
        <Enthusiast />
      </IntroductionWrapper>
    </Container>
  </section>
);

addToFonts(<Introduction />);
