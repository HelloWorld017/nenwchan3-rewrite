import IconGitHub from '@/assets/icons/IconGithub.svg?react';
import { Container } from '@/fragments/_components/Container';
import { SectionTitle } from '@/fragments/_components/SectionTitle';
import { IconMail } from '@/icons';
import { hoverStyle } from '@/styles';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { addToFonts } from 'virtual:fontsubsetter';
import type { ReactNode } from 'react';

defineI18n(
  yaml => yaml`
    # scope: contact
    description: |
      저에게 개인적으로 연락하시고 싶으신 분께서는 다음과 같은 방법으로 연락하실 수 있습니다.<br />
      궁금하신 사항 등이 있으시다면 부담없이 연락주시면 감사하겠습니다!
  `,
);

const ContactChipWrapper = styled.a`
  display: flex;
  align-items: center;
  background: var(--bluegrey-900);
  color: var(--bluegrey-700);
  padding: 0.8rem 1.6rem;
  border-radius: 1.5rem;
  gap: 1rem;

  ${hoverStyle};
`;

const ContactChipIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.4rem;
`;

const ContactChipText = styled.span`
  color: var(--bluegrey-600);
  font-size: 1.8rem;
  font-weight: 500;
  line-height: 2.2rem;
`;

type ContactChipProps = {
  icon: ReactNode;
  href: string;
  children: ReactNode;
};

const ContactChip = ({ icon, href, children }: ContactChipProps) => (
  <li>
    <ContactChipWrapper href={href}>
      <ContactChipIcon>{icon}</ContactChipIcon>
      <ContactChipText>{children}</ContactChipText>
    </ContactChipWrapper>
  </li>
);

const ContactDescription = styled.p`
  color: var(--bluegrey-300);
  font-size: 2rem;
  line-height: 2.8rem;
  margin-top: 2.8rem;
  margin-bottom: 4.8rem;
`;

const ContactList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
`;

export const Contact = () => (
  <section>
    <Container>
      <SectionTitle>Contact</SectionTitle>
      <ContactDescription>
        <t._ $tags={{ br: 'br' }}>{t.contact.description}</t._>
      </ContactDescription>
      <ContactList>
        <ContactChip icon={<IconGitHub />} href="https://github.com/HelloWorld017">
          @HelloWorld017
        </ContactChip>
        <ContactChip icon={<IconMail />} href="mailto:khi@nenw.dev">
          khi@nenw.dev
        </ContactChip>
      </ContactList>
    </Container>
  </section>
);

addToFonts(<Contact />);
