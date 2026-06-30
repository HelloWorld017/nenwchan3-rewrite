import { styled } from '@linaria/react';

export const Container = styled.div<{ wide?: boolean }>`
  max-width: ${({ wide }) => wide ? 1540 : 1170}px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 30px;
  padding-right: 30px;
`;
