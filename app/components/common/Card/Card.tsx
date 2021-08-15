import { styled } from "@linaria/react";

export const Card = styled.div`
	background: var(--grey-900);
	border-radius: 1rem;
	box-shadow: 0px .5rem 2rem var(--shadow-400);
	padding: 2.5rem;
`;

export const GlassCard = styled.div`
	border-radius: 1rem;
	backdrop-filter: blur(5rem);
	background: rgba(var(--grey-100_rgb), .3);
`;
