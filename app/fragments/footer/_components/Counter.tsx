import { mutateIncreaseCounter, queryGetCounter } from '@/schemas';
import { styled } from '@linaria/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addToFonts } from 'virtual:fontsubsetter';

const CounterDigits = styled.div`
  display: flex;
  font-weight: 700;
`;

const CounterDigit = styled.span`
  &::before {
    content: attr(data-current);
  }

  &[data-next]::after {
    content: attr(data-next);
  }
`;

export const Counter = () => {
  const { data: currentCounter } = useQuery(queryGetCounter());
  const { data: nextCounter } = useMutation(mutateIncreaseCounter);
  if (!currentCounter) {
    return null;
  }

  const currentDigits = currentCounter.count.toString().split('');
  const nextDigits = nextCounter?.count.toString().split('');

  return (
    <CounterDigits aria-label={`${currentCounter.count}`}>
      {Array.from({ length: Math.max(currentDigits.length, nextDigits?.length ?? 0) }).map(
        (_, index) => (
          <CounterDigit data-current={currentDigits[index]} data-next={nextDigits?.[index]} />
        ),
      )}
    </CounterDigits>
  );
};

addToFonts(<CounterDigits>0123456789</CounterDigits>);
