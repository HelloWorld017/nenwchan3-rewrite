import { styled } from '@linaria/react';

export const Timeline = styled.div`
	& > * {
		margin: 32px 0;

		&:first-of-type {
			margin-top: 0;
		}

		&:last-of-type {
			margin-bottom: 0;
		}
	}
`;
