import I18n from './Sidebar.i18n.yml';
import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';
import { useI18n } from '@simplei18n/react';
import { SidebarButton } from './SidebarButton';
import { SidebarBranding, SidebarItem } from './SidebarItem';

const SidebarWrapper = styled.div`
	visibility: hidden;
	pointer-events: none;

	&[data-is-visible="true"] {
		visibility: visible;
		pointer-events: auto;
	}
`;

const SidebarContainer = styled.aside`
	position: fixed;
	top: 0;
	left: 0;
	width: 50rem;
	height: 100%;
	padding: 16rem 10rem;

	background: var(--grey-200);
	transform: translateX(-50rem);
	transition: transform .4s ease;

	[data-is-opened="true"] > & {
		transform: translateX(0rem);
	}
`;

const SidebarBackdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: var(--grey-280);
	opacity: 0;
	transition: opacity .4s ease;

	[data-is-opened="true"] > & {
		opacity: .7;
	}
`;

export const Sidebar = () => {
	const { t, ts } = useI18n(I18n);

	const [ isOpened, setIsOpened ] = useState(false);
	const [ isAnimating, setIsAnimating ] = useState(false);

	const onClose = useCallback(() => {
		setIsOpened(false);
		setIsAnimating(true);
	}, []);

	const onToggle = useCallback(() => {
		setIsOpened(!isOpened);
		setIsAnimating(true);
	}, [ isOpened ]);

	const onTransitionEnd = useCallback(() => {
		setIsAnimating(false);
	}, []);

	return (
		<>
			<SidebarWrapper data-is-opened={ isOpened } data-is-visible={ isOpened || isAnimating }>
				<SidebarBackdrop onClick={ onClose } />
				<SidebarContainer onTransitionEnd={ onTransitionEnd }>
					<SidebarBranding header={ ts('header') } description={ ts('description') } />
					<SidebarItem title={ ts('blog.title') } href="https://blog.nenw.dev">
						{ t('blog.description') }
					</SidebarItem>
					<SidebarItem title={ ts('telegram.title') } href="https://t.me/Khinenw">
						{ t('telegram.description') }
					</SidebarItem>
					<SidebarItem title={ ts('github.title') } href="https://github.com/HelloWorld017">
						{ t('github.description') }
					</SidebarItem>
				</SidebarContainer>
			</SidebarWrapper>


			<SidebarButton onToggle={ onToggle } isOpened={ isOpened } />
		</>
	)
}
