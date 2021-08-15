import I18n from './SectionLanding.i18n.yml';
import { styled } from '@linaria/react';
import { useI18n } from '@simplei18n/react';
import { Container } from '@/components/common/Container';
import { FullPageDimmer } from '@/components/common/FullPageDimmer';
import { GlassCard } from '@/components/common/Card';
import { ReactComponent as LogoMonochrome } from '@/components/images/LogoMonochrome.svg';
import { ReactComponent as IconAsterisk } from '@/components/images/IconAsterisk.svg';
import { ReactComponent as IconChevronDown } from '@/components/images/IconChevronDown.svg';

const LandingCard = styled(GlassCard)`
	display: flex;
	align-items: center;
	padding: 5rem;
`;

const LandingCardLogo = styled(LogoMonochrome)`
	font-size: 9rem;
`;

const LandingCardColumn = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 5rem;
`;

const LandingCardDescription = styled.p`
	color: var(--grey-900);
	font-family: var(--font-sans);
	font-size: 2.4rem;
	font-weight: 400;
	margin: 0;
`;

const LandingCardTitle = styled.h2`
	color: var(--grey-900);
	font-family: var(--font-sans);
	font-size: 3.6rem;
	font-weight: 500;
	margin: 0;
`;

const LandingContainer = styled(Container)`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-end;
	height: 100%;
`;

const ScrollIndicator = styled.a`
	display: flex;
	align-items: center;
	margin-top: 10rem;
	margin-bottom: -4rem;
	font-size: 2.4rem;
	font-family: var(--font-display);
	font-weight: 500;
	letter-spacing: 0;
	text-decoration: none;
	text-transform: uppercase;
	color: var(--grey-900);
`;

const ScrollIndicatorIcon = styled(IconChevronDown)`
	margin-left: 2.4rem;
	font-size: 1.8rem;
	color: var(--grey-900);
`;

const SectionWrapper = styled.section`
	background-image: url(@/images/SectionBackground.png);
	background-color: var(--grey-200);
	background-size: cover;

	padding: 10vh 0;
	height: 100vh;
`;

export const SectionLanding = (): JSX.Element => {
	const { t } = useI18n(I18n);
	return (
		<SectionWrapper id="Landing">
			<FullPageDimmer />
			<LandingContainer>
				<LandingCard>
					<LandingCardLogo />
					<LandingCardColumn>
						<LandingCardTitle>
							<LandingCardDescription>{ t('card.description') }</LandingCardDescription>

							{ t('card.title', { Asterisk: IconAsterisk }) }
						</LandingCardTitle>
					</LandingCardColumn>
				</LandingCard>

				<ScrollIndicator href="#Abstract">
					{ t('scroll') }
					<ScrollIndicatorIcon />
				</ScrollIndicator>
			</LandingContainer>
		</SectionWrapper>
	);
};
