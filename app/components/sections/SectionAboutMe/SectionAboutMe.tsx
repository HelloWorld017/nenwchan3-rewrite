import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '@/components/common/Card';
import { Container } from '@/components/common/Container';
import { ReactComponent as Logo } from '@/components/images/Logo.svg';
import { ReactComponent as LogoName } from '@/components/images/LogoName.svg';

const ProfileRow = styled.div`
	display: flex;
`;

const ProfileColumn = styled.div`
	margin-left: 4rem;
	display: flex;
	flex-direction: column;
`;

const ProfileLogo = () => <Logo className={ css`font-size: 9rem;` } />;
const ProfileName = () => <LogoName className={ css`font-size: 14rem;` } />;

const ProfileBio = styled.p`
	margin-top: 2rem;
	font-family: var(--font-display);
	font-size: 2.2rem;
	color: var(--grey-600);
`;

const ProfileCard = () => {
	const { t } = useTranslation();

	return (
		<Card>
			<ProfileRow>
				<ProfileLogo />
				<ProfileColumn>
					<ProfileName />
					<ProfileBio>`{t('SectionAboutMe.bio')}`</ProfileBio>
				</ProfileColumn>
			</ProfileRow>
			<ProfileBio>
				<Trans i18nKey='SectionAboutMe.description' t={ t } components={{ tagKhinenw: <span style={{background: '#000'}}></span> }} />
				{t('SectionAboutMe.description', [ <span>aa</span> ])}
			</ProfileBio>
		</Card>
	);
};

export const SectionAboutMe = (): JSX.Element => {
	return (
		<section>
			<Container>
				<ProfileCard />
			</Container>
		</section>
	);
};
