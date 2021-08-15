import { styled } from '@linaria/react';
import { ReactComponent as IconArrowRight } from '@/components/images/IconArrowRight.svg';
import type { ReactNode } from 'react';

const SidebarBrandingWrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 4rem;
`;

const SidebarBrandingHeader = styled.h1`
	color: var(--grey-900);
	font-family: var(--font-display);
	font-weight: 300;
	font-size: 3.2rem;
	letter-spacing: 0;
	margin-top: 0;
	margin-bottom: .6rem;
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

const SidebarItemTitle = styled.span`
	font-family: var(--font-display);
	font-weight: 500;
	font-size: 2.4rem;
	color: var(--grey-900);
	padding: .3rem 1rem;
	padding-right: 1.4rem;
	transition: background .4s ease;
`;

const SidebarItemIcon = styled(IconArrowRight)`
	display: inline-block;
	font-size: 1.6rem;
	margin-left: .8rem;
	transition: transform .4s ease;
`;

const SidebarItemDescription = styled.span`
	font-family: var(--font-sans);
	font-weight: 300;
	font-size: 1.8rem;
	color: var(--grey-900);
	margin-top: .4rem;
	padding: .3rem 1rem;
	transition: background .4s ease;
`;

const SidebarItemWrapper = styled.a`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	text-decoration: none;
	margin: 0 -1rem;
	margin-top: 3rem;
	transition: transform .4s ease;

	&:hover {
		transform: translate(1rem);

		${SidebarItemIcon} {
			transform: translate(.4rem);
		}

		${SidebarItemTitle}, ${SidebarItemDescription} {
			background: var(--bluegrey-600);
		}
	}
`;

type SidebarItemProps = {
	title: string,
	children: ReactNode,
	href: string
};

export const SidebarItem = ({ title, children, href }: SidebarItemProps) => {
	return (
		<SidebarItemWrapper href={ href }>
			<SidebarItemTitle>
				{ title }

				<SidebarItemIcon />
			</SidebarItemTitle>
			<SidebarItemDescription>
				{ children }
			</SidebarItemDescription>
		</SidebarItemWrapper>
	)
}
