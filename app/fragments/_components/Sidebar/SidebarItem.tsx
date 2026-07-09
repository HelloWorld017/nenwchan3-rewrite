import IconArrowRight from '@/assets/icons/IconArrowRight.svg?react';
import { styled } from '@linaria/react';
import type { ReactNode } from 'react';

const SidebarBrandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4rem;
`;

const SidebarBrandingHeader = styled.h1`
  color: var(--grey-900);
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 3.2rem;
  letter-spacing: 0;
  margin-top: 0;
  margin-bottom: 0.6rem;
`;

const SidebarBrandingDescription = styled.p`
  color: var(--grey-600);
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.8rem;
  letter-spacing: 0;
  margin: 0;
`;

type SidebarBrandingProps = {
  header: string;
  description: string;
};

export const SidebarBranding = ({ header, description }: SidebarBrandingProps) => (
  <SidebarBrandingWrapper>
    <SidebarBrandingHeader>{header}</SidebarBrandingHeader>
    <SidebarBrandingDescription>{description}</SidebarBrandingDescription>
  </SidebarBrandingWrapper>
);

const SidebarItemTitle = styled.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 2.4rem;
  color: var(--grey-900);
  padding: 1rem 1rem 0;
  padding-right: 1.4rem;
  transition: background var(--transition-default);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const SidebarItemIcon = styled(IconArrowRight)`
  display: inline-block;
  font-size: 1.6rem;
  margin-left: 0.8rem;
  transition: transform var(--transition-default);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const SidebarItemDescription = styled.span`
  font-family: var(--font-sans);
  font-weight: 300;
  font-size: 1.8rem;
  color: var(--grey-900);
  padding: 1rem 1rem;
  border-top-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  transition: background var(--transition-default);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const SidebarItemWrapper = styled.a`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  margin: 0 -1rem;
  margin-top: 2rem;
  transition: transform var(--transition-default);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    transform: translate(1rem);

    ${SidebarItemIcon} {
      transform: translate(0.4rem);
    }

    ${SidebarItemTitle}, ${SidebarItemDescription} {
      background: var(--bluegrey-600);
    }
  }
`;

type SidebarItemProps = {
  title: string;
  children: ReactNode;
  href: string;
};

export const SidebarItem = ({ title, children, href }: SidebarItemProps) => (
  <SidebarItemWrapper href={href}>
    <SidebarItemTitle>
      {title}

      <SidebarItemIcon />
    </SidebarItemTitle>
    <SidebarItemDescription>{children}</SidebarItemDescription>
  </SidebarItemWrapper>
);
