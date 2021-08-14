import I18n from './Sidebar.i18n.yml';
import { SidebarButton } from './SidebarButton';
import { SidebarBranding } from './SidebarItem';
import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';
import { useI18n } from '@simplei18n/react';

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

	&[data-is-opened="true"] {
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

	&[data-is-opened="true"] {
		opacity: .7;
	}
`;

export const Sidebar = () => {
	const { ts } = useI18n(I18n);

	const [ isOpened, setIsOpened ] = useState(false);
	const isOpenedAttr = isOpened ? 'true' : 'false';

	const onClose = useCallback(() => {
		setIsOpened(false);
	}, []);

	const onToggle = useCallback(() => {
		setIsOpened(!isOpened);
	}, [ isOpened ]);

	return (
		<>
			<SidebarBackdrop data-is-opened={ isOpenedAttr } onClick={ onClose } />
			<SidebarContainer data-is-opened={ isOpenedAttr }>
				<SidebarBranding header={ ts('header') } description={ ts('description') } />
			</SidebarContainer>
			<SidebarButton onToggle={ onToggle } isOpened={ isOpened } />
		</>
	)
}
