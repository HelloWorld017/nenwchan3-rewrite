import { styled } from '@linaria/react';
import type { ReactNode } from 'react';

const DividerContainer = styled.div`
	color: var(--grey-700);
	font-family: var(--font-display);
	font-size: 2.4rem;
	font-weight: 500;
	padding-top: 5rem;
	padding-right: 10rem;
	padding-bottom: 5rem;
	text-align: right;
`;

const DividerEmphasize = styled.span`
	color: var(--grey-100);
`;

export const DividerIndex = ({ children }: { children: ReactNode }) => (
	<DividerContainer>
		{ 'nenw . ' }
		<DividerEmphasize>{ children }</DividerEmphasize>
	</DividerContainer>
);
