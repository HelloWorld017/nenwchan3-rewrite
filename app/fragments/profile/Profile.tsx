import Logo from '@/assets/icons/Logo.svg?react';
import LogoText from '@/assets/icons/LogoText.svg?react';
import { Container } from '@/fragments/_components/Container';
import { breakpoints } from '@/styles';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { addToFonts } from 'virtual:fontsubsetter';

defineI18n(
  yaml => yaml`
    #scope: profile
    bio: 'Aviate in Progress'
    description: |
      안녕하세요! 저는 소프트웨어 개발에 관심이 많은 김요한이라고 합니다.<br/>
      저는 주로 <tag>nenw*</tag> 또는 <tag>Khinenw</tag> 라는 이름으로 활동하고 있습니다.
  `,
);

const ProfileSection = styled.section`
  padding-top: 15rem;
`;

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

export const Profile = () => (
  <ProfileSection>
    <Container>
      <ProfileWrapper>
        <ProfileColumn>
          <ProfileLogo />
          <ProfileLogoText aria-label="nenw*" />
          <ProfileBio>
            `<t._>{t.profile.bio}</t._>`
          </ProfileBio>
        </ProfileColumn>
        <DescriptionText>
          <t._ $tags={{ br: 'br', tag: Tag }}>{t.profile.description}</t._>
        </DescriptionText>
      </ProfileWrapper>
    </Container>
  </ProfileSection>
);

addToFonts(<Profile />);
