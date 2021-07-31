import { styled } from '@linaria/react';

export const FullPageDimmer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height:  100%;
	background: linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 57.66%), rgba(0, 0, 0, 0.5);
`;
