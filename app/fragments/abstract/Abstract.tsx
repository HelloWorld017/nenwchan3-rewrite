import IconQuote from '@/assets/icons/IconQuote.svg?react';
import Logo from '@/assets/icons/Logo.svg?react';
import LogoText from '@/assets/icons/LogoText.svg?react';
import { Container } from '@/fragments/_components/Container';
import { breakpoints } from '@/styles';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { addToFonts } from 'virtual:fontsubsetter';
import { ScrollVideo } from './_components/ScrollVideo/ScrollVideo';

defineI18n(
  yaml => yaml`
    #scope: abstract
    profile:
      bio: 'Aviate in Progress'
      description: |
        안녕하세요! 저는 소프트웨어 개발에 관심이 많은 김요한이라고 합니다.<br/>
        저는 주로 <tag>nenw*</tag> 또는 <tag>Khinenw</tag> 라는 이름으로 활동하고 있습니다.

    quote:
      text: '난 있지, 특별해지고 싶어.'
      source: '「울려라! 유포니엄」 작중 대사'

    abstract: |
      저는 누군가의 기억에 남는 무언가를 만들고 싶습니다.<br/>
      그렇기에 저는 사람의 마음에 닿는 디자인을 고민하고,<br/>
      그것을 현실에서 구현하기 위한 엔지니어링을 하고 싶습니다.
  `,
);

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileColumn = styled.div`
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileLogo = styled(Logo)`
  font-size: 12rem;
`;

const ProfileLogoText = styled(LogoText)`
  font-size: 4.2rem;
`;

const ProfileBio = styled.span`
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 500;
  color: var(--grey-600);
  margin-top: 2rem;
  text-align: center;
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

const Tag = styled.code`
  color: var(--grey-300);
  background: var(--grey-800);
  font-family: var(--font-code);
  border-radius: 0.5rem;
  padding: 0.1rem 0.6rem;
`;

const Profile = () => (
  <ProfileWrapper>
    <ProfileColumn>
      <ProfileLogo />
      <ProfileLogoText aria-label="nenw*" />
      <ProfileBio>
        `<t._>{t.abstract.profile.bio}</t._>`
      </ProfileBio>
    </ProfileColumn>
    <DescriptionText>
      <t._ $tags={{ br: 'br', tag: Tag }}>{t.abstract.profile.description}</t._>
    </DescriptionText>
  </ProfileWrapper>
);

const Card = styled.div`
  background: var(--grey-900);
  border-radius: 2rem;
  box-shadow: var(--shadow-400);
  padding: 2.5rem;
`;

const QuoteWrapper = styled.div`
  max-width: 60rem;
  margin-top: 10rem;
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

const Quote = () => (
  <QuoteWrapper>
    <Card>
      <QuoteInner>
        <QuoteIcon />
        <QuoteText>
          <t._>{t.abstract.quote.text}</t._>
        </QuoteText>
        <QuoteSource>
          <t._>{t.abstract.quote.source}</t._>
        </QuoteSource>
      </QuoteInner>
    </Card>
  </QuoteWrapper>
);

const AbstractDescriptionWrapper = styled.div`
  margin-top: 2rem;
`;

const AbstractWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15rem;
`;

export const Abstract = () => (
  <AbstractWrapper id="Abstract">
    <Container>
      <Profile />
      <Quote />
    </Container>
    <ScrollVideo />
    <Container>
      <AbstractDescriptionWrapper>
        <DescriptionText>
          <t._ $tags={{ br: 'br' }}>{t.abstract.abstract}</t._>
        </DescriptionText>
      </AbstractDescriptionWrapper>
    </Container>
  </AbstractWrapper>
);

addToFonts(<Abstract />);
