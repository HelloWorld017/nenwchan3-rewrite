import { styled } from "@linaria/react";

const TRANSITION_EASING = 'cubic-bezier(0.74,-0.51, 0.46, 1.01)';

const SidebarButtonBar = styled.div<{ direction: number }>`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 3rem;
	height: .3rem;
	margin-left: -1.5rem;
	margin-top: -.15rem;

	border-radius: .3rem;
	background: var(--grey-900);
	transition: background .4s ease, transform .4s ${TRANSITION_EASING};
	transform: rotate(-45deg) ${ ({ direction }) => `translate(0, ${direction * -0.5}rem)` };

	[data-is-active="true"] & {
		transform: ${ ({ direction }) => `rotate(${ (direction - 1) * 45 + 45 }deg)` };
	}
`;

const SidebarButtonWrapper = styled.button`
	position: fixed;
	top: 5rem;
	left: 10rem;
	width: 7rem;
	height: 7rem;

	cursor: pointer;
	border: none;
	border-radius: 1rem;
	background: transparent;
	transition: background .4s ease, transform .4s ${TRANSITION_EASING};
	transform: rotate(45deg);

	&[data-is-active="true"] {
		transform: rotate(90deg);
	}

	&:hover, &[data-is-active="true"] {
		background: var(--grey-900);

		${SidebarButtonBar} {
			background: var(--grey-100);
		}
	}
`;

type SidebarButtonProps = {
	className?: string,
	onToggle: () => void,
	isOpened: boolean
};

export const SidebarButton = ({ className, onToggle, isOpened }: SidebarButtonProps) => (
	<SidebarButtonWrapper
		className={ className }
		data-is-active={ isOpened ? 'true' : 'false' }
		onClick={ onToggle }
		type="button"
	>
		<SidebarButtonBar direction={ -1 } />
		<SidebarButtonBar direction={  1 } />
	</SidebarButtonWrapper>
);
