import { styled } from "@linaria/react";

const ProgressBarContainer = styled.div`
	width: 10rem;
	display: flex;
	justify-content: space-between;
`;

const Track = styled.div<{ size: number }>`
	width: ${ ({ size }) => `${size}%` };
	height: .2rem;

	border-radius: .1rem;
	background: var(--grey-900);
	transition: width .4s ease;
`;

const Dot = styled.div<{ position: number }>`
	position: absolute;
	top: -0.3rem;
	left: ${ ({ position }) => `${position}%` };
	width: .8rem;
	height: .8rem;

	border-radius: .4rem;
	background: var(--grey-900);
	transition: left .4s ease;
`;

const DOT_MARGIN = 4;
const DOT_SIZE = 8;

export const ProgressBar = ({ className, progress }: { className?: string, progress: number }) => {
	const dotProgress = progress * (100 + DOT_MARGIN * 2 + DOT_SIZE * 2) / 100 - DOT_MARGIN - DOT_SIZE;
	const trackProgress = Math.max(-DOT_MARGIN, Math.min(dotProgress, 100 + DOT_MARGIN));
	const trackProgressLeft = Math.max(0, Math.min(trackProgress - DOT_SIZE, 100));
	const trackProgressRight = Math.max(0, Math.min(100 - trackProgress - 2 * DOT_SIZE, 100));

	return (
		<ProgressBarContainer className={className}>
			<Track size={trackProgressLeft} />
			<Track size={trackProgressRight} />
			<Dot position={dotProgress} />
		</ProgressBarContainer>
	);
}
