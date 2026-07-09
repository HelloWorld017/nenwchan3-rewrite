import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMergedRef } from '@/hooks/useMergedRef';
import { mutateIncreaseCounter, queryGetCounter } from '@/schemas';
import { styled } from '@linaria/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { addToFonts } from 'virtual:fontsubsetter';

const CounterDigits = styled.div`
  display: flex;
  font-size: 5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  background: linear-gradient(to right bottom, #0e9ff0, #6a6a6a);
  isolation: isolate;
  margin: -5rem 0;
`;

const CounterDigit = styled.span`
  mix-blend-mode: screen;
  background: white;
  color: black;

  position: relative;
  display: inline-grid;
  padding: 5rem 0;
  grid-template-columns: 1fr;
  overflow: hidden;

  &::before,
  &::after {
    display: inline-block;
    grid-area: 1 / 1;
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1);
  }

  &::before {
    content: attr(data-current);
  }

  &[data-next]::after {
    content: attr(data-next);
    opacity: 0;
  }

  [data-animated='true'] > &[data-next] {
    &::before {
      animation-name: counter-out;
    }

    &::after {
      animation-name: counter-in;
    }

    @media (prefers-reduced-motion: reduce) {
      &::before,
      &::after {
        animation-name: none;
      }

      &::before {
        visibility: hidden;
      }

      &::after {
        opacity: 1;
      }
    }
  }

  @keyframes counter-in {
    from {
      transform: translate(0, 5rem);
      opacity: 0;
    }

    to {
      transform: translate(0, 0);
      opacity: 1;
    }
  }

  @keyframes counter-out {
    from {
      transform: translate(0, 0);
      opacity: 1;
    }

    to {
      transform: translate(0, -5rem);
      opacity: 0;
    }
  }
`;

export const Counter = () => {
  const { data: currentCounter } = useQuery(queryGetCounter());
  const { data: nextCounter, mutate: increase } = useMutation(mutateIncreaseCounter);

  const hasIncreasedRef = useRef(false);
  const increaseRef = useIntersectionObserver(() => {
    if (!hasIncreasedRef.current) {
      hasIncreasedRef.current = true;
      increase();
    }
  });

  const [isAnimated, setIsAnimated] = useState(false);
  const animateRef = useIntersectionObserver(
    entry => {
      if (entry.isIntersecting) {
        setIsAnimated(true);
      }
    },
    { threshold: 1 },
  );

  const ref = useMergedRef(increaseRef, animateRef);

  if (!currentCounter) {
    return null;
  }

  const currentDigits = currentCounter.count.toString().split('');
  const nextDigits = nextCounter?.count.toString().split('');
  const label = nextCounter?.count ?? currentCounter.count;

  return (
    <CounterDigits aria-label={`${label}`} data-animated={isAnimated} ref={ref}>
      {Array.from({ length: Math.max(currentDigits.length, nextDigits?.length ?? 0) }).map(
        (_, index) => {
          const current = currentDigits[index];
          const next = nextDigits?.[index];
          const hasNext = next !== undefined && next !== current;
          return (
            <CounterDigit
              key={index}
              data-current={current}
              {...(hasNext && { 'data-next': next })}
            />
          );
        },
      )}
    </CounterDigits>
  );
};

addToFonts(<CounterDigits>0123456789</CounterDigits>);
