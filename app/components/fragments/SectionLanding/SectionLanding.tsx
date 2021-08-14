import { styled } from '@linaria/react';
import { Container } from '@/components/common/Container';
import { FullPageDimmer } from '@/components/common/FullPageDimmer';

const SectionWrapper = styled.section`
	background-image: url(@/images/SectionBackground.png);
	background-color: var(--grey-200);
	background-size: cover;

	padding: 10vh 0;
	min-height: 100vh;
`;

export const SectionLanding = (): JSX.Element => {
	return (
		<SectionWrapper>
			<FullPageDimmer />
			<Container>
			</Container>
		</SectionWrapper>
	);
};
