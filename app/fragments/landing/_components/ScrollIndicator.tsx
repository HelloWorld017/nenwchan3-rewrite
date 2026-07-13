import { styled } from '@linaria/react';
import { addToFonts } from 'virtual:fontsubsetter';

const ScrollIndicatorWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3rem;
  margin-top: 4rem;
  color: var(--grey-900);
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.3;
`;

const ScrollBar = styled.span`
  position: relative;
  display: block;
  width: 0.2rem;
  height: 2.4rem;
  overflow: hidden;

  &::after {
    position: absolute;
    inset: 0;
    height: 40%;
    background: currentColor;
    content: '';
    animation: scroll-indicator 1.6s cubic-bezier(0.76, 0, 0.24, 1) infinite;
    border-radius: 5rem;
  }

  @keyframes scroll-indicator {
    from {
      transform: translateY(-100%);
    }

    to {
      transform: translateY(250%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
      transform: translateY(75%);
    }
  }
`;

export const ScrollIndicator = () => (
  <ScrollIndicatorWrapper>
    <ScrollBar aria-hidden />
    <span>Scroll</span>
  </ScrollIndicatorWrapper>
);

addToFonts(<ScrollIndicator />);
