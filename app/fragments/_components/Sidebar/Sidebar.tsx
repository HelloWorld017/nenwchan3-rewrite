import { breakpoints, zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t, useI18n } from '@simplei18n/core/react';
import { useCallback, useState } from 'react';
import { addToFonts } from 'virtual:fontsubsetter';
import { SidebarButton } from './SidebarButton';
import { SidebarBranding, SidebarItem } from './SidebarItem';
import type { TransitionEvent } from 'react';

defineI18n(
  yaml => yaml`
    # scope: sidebar
    header: 'nenw.dev'
    description: '2026 Redesigned'

    blog:
      title: 'Blog'
      description: '제가 알게된 것들을 정리해서 올리는 곳'

    misskey:
      title: 'Misskey'
      description: '제가 랜덤한 말을 올리는 곳'

    email:
      title: 'Email'
      description: '저에게 연락을 하실 수 있는 곳'

    github:
      title: 'GitHub'
      description: '저의 프로젝트를 보실 수 있는 곳'
  `,
);

const SidebarWrapper = styled.div`
  visibility: hidden;
  pointer-events: none;

  &[data-is-visible='true'] {
    visibility: visible;
    pointer-events: auto;
  }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 3rem;
  bottom: 3rem;
  left: 4rem;
  width: 45rem;
  padding: 14rem 4rem;
  border-radius: 3rem;

  background: color-mix(var(--grey-200) 70%, transparent 30%);
  background-image: linear-gradient(to left top, transparent, rgba(0, 0, 0, 0.2));
  backdrop-filter: blur(2rem);
  transform: translateX(calc(-100% - 4rem));
  transition: transform var(--transition-container);
  z-index: ${zLayer.overlay};

  [data-is-opened='true'] > & {
    transform: translateX(0rem);
  }

  @media (max-width: ${breakpoints.md}px) {
    width: auto;
    right: 4rem;
  }
`;

const SidebarBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: color-mix(var(--grey-100) 60%, transparent 10%);
  background-image: linear-gradient(110deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 100%);
  opacity: 0;
  transition: opacity var(--transition-container);
  z-index: ${zLayer.overlay};

  [data-is-opened='true'] > & {
    opacity: 1;
  }
`;

export const Sidebar = () => {
  const { ts } = useI18n();

  const [isOpened, setIsOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const onClose = useCallback(() => {
    setIsOpened(false);
    setIsAnimating(true);
  }, []);

  const onToggle = useCallback(() => {
    setIsOpened(!isOpened);
    setIsAnimating(true);
  }, [isOpened]);

  const onTransitionEnd = useCallback((event: TransitionEvent) => {
    if (event.target === event.currentTarget) {
      setIsAnimating(false);
    }
  }, []);

  return (
    <>
      <SidebarWrapper data-is-opened={isOpened} data-is-visible={isOpened || isAnimating}>
        <SidebarBackdrop onClick={onClose} />
        <SidebarContainer onTransitionEnd={onTransitionEnd}>
          <SidebarBranding header={ts(t.sidebar.header)} description={ts(t.sidebar.description)} />
          <SidebarItem title={ts(t.sidebar.blog.title)} href="https://blog.nenw.dev">
            <t._>{t.sidebar.blog.description}</t._>
          </SidebarItem>
          <SidebarItem title={ts(t.sidebar.email.title)} href="mailto:khi@nenw.dev">
            <t._>{t.sidebar.email.description}</t._>
          </SidebarItem>
          <SidebarItem title={ts(t.sidebar.misskey.title)} href="https://social.nenw.dev/@nenw">
            <t._>{t.sidebar.misskey.description}</t._>
          </SidebarItem>
          <SidebarItem title={ts(t.sidebar.github.title)} href="https://github.com/HelloWorld017">
            <t._>{t.sidebar.github.description}</t._>
          </SidebarItem>
        </SidebarContainer>
      </SidebarWrapper>

      <SidebarButton onToggle={onToggle} isOpened={isOpened} />
    </>
  );
};

addToFonts(<Sidebar />);
