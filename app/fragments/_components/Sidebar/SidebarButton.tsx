import { zLayer } from '@/styles';
import { styled } from '@linaria/react';

const SidebarButtonBar = styled.div<{ direction: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3rem;
  height: 0.3rem;
  margin-left: -1.5rem;
  margin-top: -0.15rem;

  border-radius: 0.3rem;
  background: var(--grey-900);
  transition:
    background var(--transition-default),
    transform var(--transition-bounce);
  transform: rotate(-45deg) ${({ direction }) => `translate(0, ${direction * -0.5}rem)`};

  [data-is-active='true'] & {
    transform: ${({ direction }) => `rotate(${(direction - 1) * 45 + 45}deg)`};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background var(--transition-default);
  }
`;

const SidebarButtonWrapper = styled.button`
  position: fixed;
  top: 6rem;
  left: 8rem;
  width: 7rem;
  height: 7rem;

  border: none;
  border-radius: 1rem;
  background: transparent;
  transition:
    background var(--transition-default),
    transform var(--transition-bounce);
  transform: rotate(45deg);
  z-index: ${zLayer.overlay};

  &[data-is-active='true'] {
    transform: rotate(90deg);
  }

  &:hover,
  &[data-is-active='true'] {
    background: var(--grey-900);

    ${SidebarButtonBar} {
      background: var(--grey-100);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background var(--transition-default);
  }
`;

type SidebarButtonProps = {
  className?: string;
  onToggle: () => void;
  isOpened: boolean;
};

export const SidebarButton = ({ className, onToggle, isOpened }: SidebarButtonProps) => (
  <SidebarButtonWrapper
    className={className}
    data-is-active={isOpened ? 'true' : 'false'}
    onClick={onToggle}
    type="button"
  >
    <SidebarButtonBar direction={-1} />
    <SidebarButtonBar direction={1} />
  </SidebarButtonWrapper>
);
