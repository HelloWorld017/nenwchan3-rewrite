import IconQuote from '@/assets/icons/IconQuote.svg?react';
import { Container } from '@/fragments/_components/Container';
import { breakpoints } from '@/styles';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { addToFonts } from 'virtual:fontsubsetter';
import { QuoteScrollVideo } from './_components/QuoteScrollVideo';

defineI18n(
  yaml => yaml`
    #scope: quote
    text: '난 있지, 특별해지고 싶어.'
    source: '「울려라! 유포니엄」 작중 대사'
    summary: |
      저는 누군가의 기억에 남는 무언가를 만들고 싶습니다.<br/>
      그렇기에 저는 사람의 마음에 닿는 디자인을 고민하고,<br/>
      그것을 현실에서 구현하기 위한 엔지니어링을 하고 싶습니다.
  `,
);

const QuoteSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const QuoteWrapper = styled.div`
  max-width: 60rem;
  margin: 10rem auto 0;
`;

const Card = styled.div`
  background: var(--grey-900);
  border-radius: 2rem;
  box-shadow: var(--shadow-400);
  padding: 2.5rem;
`;

const QuoteInner = styled.blockquote`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
`;

const QuoteIcon = () => (
  <IconQuote
    className={css`
      color: var(--bluegrey-800);
      font-size: 2rem;
    `}
  />
);

const QuoteText = styled.p`
  color: var(--bluegrey-700);
  font-size: 2.4rem;
  font-family: var(--font-letter);
  margin-top: 2rem;
  margin-bottom: 4.5rem;
`;

const QuoteSource = styled.cite`
  color: var(--bluegrey-700);
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 300;

  align-self: flex-end;
  margin-left: auto;
`;

const DescriptionText = styled.p`
  margin-top: 5rem;
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.6em;
  text-align: center;
  color: var(--grey-400);

  @media (max-width: ${breakpoints.sm}px) {
    br {
      display: none;
    }
  }
`;

const SummaryWrapper = styled.div`
  margin-top: 2rem;
`;

export const Quote = () => (
  <QuoteSection>
    <QuoteScrollVideo />
    <Container>
      <QuoteWrapper>
        <Card>
          <QuoteInner>
            <QuoteIcon />
            <QuoteText>
              <t._>{t.quote.text}</t._>
            </QuoteText>
            <QuoteSource>
              <t._>{t.quote.source}</t._>
            </QuoteSource>
          </QuoteInner>
        </Card>
      </QuoteWrapper>
    </Container>
    <Container>
      <SummaryWrapper>
        <DescriptionText>
          <t._ $tags={{ br: 'br' }}>{t.quote.summary}</t._>
        </DescriptionText>
      </SummaryWrapper>
    </Container>
  </QuoteSection>
);

addToFonts(<Quote />);
