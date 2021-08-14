import { styled } from '@linaria/react';

const SidebarBrandingWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const SidebarBrandingHeader = styled.h1`
	color: var(--grey-900);
	font-family: var(--font-display);
	font-weight: 300;
	font-size: 3.2rem;
	letter-spacing: 0;
	margin-top: 0;
	margin-bottom: .3rem;
`;

const SidebarBrandingDescription = styled.p`
	color: var(--grey-600);
	font-family: var(--font-display);
	font-weight: 500;
	font-size: 1.8rem;
	letter-spacing: 0;
	margin: 0;
`;

type SidebarBrandingProps = {
	header: string,
	description: string
};

export const SidebarBranding = ({ header, description }: SidebarBrandingProps) => (
	<SidebarBrandingWrapper>
		<SidebarBrandingHeader>
			{ header }
		</SidebarBrandingHeader>
		<SidebarBrandingDescription>
			{ description }
		</SidebarBrandingDescription>
	</SidebarBrandingWrapper>
);
