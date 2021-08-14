import I18n from './SectionAbstract.i18n.yml';

import { css } from '@linaria/core';
import { useI18n } from '@simplei18n/react';
import { styled } from '@linaria/react';
import { Card } from '@/components/common/Card';
import { Container } from '@/components/common/Container';
import { Divider } from '@/components/common/Divider';
import { DividerIndex } from '@/components/common/DividerIndex';
import { ReactComponent as IconQuote } from '@/components/images/IconQuote.svg';
import { ReactComponent as Logo } from '@/components/images/Logo.svg';
import { ReactComponent as LogoName } from '@/components/images/LogoName.svg';
import { Tag } from '@/components/common/Tag';

const DescriptionText = styled.p`
	margin: 0;
	font-size: 2rem;
	font-weight: 500;
	line-height: 1.6em;
	color: var(--grey-400);
`;

const ProfileWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const ProfileRow = styled.div`
	display: flex;
	margin-bottom: 3rem;
`;

const ProfileColumn = styled.div`
	margin-left: 4rem;
	display: flex;
	flex-direction: column;
`;

const ProfileLogo = () => <Logo className={ css`font-size: 9rem;` } />;
const ProfileName = () => <LogoName className={ css`font-size: 14rem;` } aria-label="nenw*" />;

const ProfileBio = styled.span`
	margin-top: 2rem;
	font-family: var(--font-display);
	font-size: 2.2rem;
	font-weight: 500;
	color: var(--grey-600);
`;

const Profile = () => {
	const { t } = useI18n(I18n);

	return (
		<ProfileWrapper>
			<ProfileRow>
				<ProfileLogo />
				<ProfileColumn>
					<ProfileName />
					<ProfileBio>`{t('profile.bio')}`</ProfileBio>
				</ProfileColumn>
			</ProfileRow>
			<DescriptionText>
				{ t('profile.description', { br: 'br', tag: Tag }) }
			</DescriptionText>
		</ProfileWrapper>
	);
};

const QuoteWrapper = styled.div`
	max-width: 60rem;
	margin-top: 10rem;
`;

const QuoteInner = styled.blockquote`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0;
`;

const QuoteIcon = () => <IconQuote className={ css`
	color: var(--blue-900);
	font-size: 2rem;
` } />;

const QuoteText = styled.p`
	color: var(--blue-800);
	font-size: 2.4rem;
	font-family: var(--font-letter);
	margin-top: 2rem;
	margin-bottom: 4.5rem;
`;

const QuoteSource = styled.cite`
	color: var(--blue-800);
	font-size: 1.6rem;
	font-style: normal;
	font-weight: 300;

	align-self: flex-end;
	margin-left: auto;
`;

const Quote = () => {
	const { t } = useI18n(I18n);

	return (
		<QuoteWrapper>
			<Card>
				<QuoteInner>
					<QuoteIcon />
					<QuoteText>{ t('quote.text') }</QuoteText>
					<QuoteSource>{ t('quote.source') }</QuoteSource>
				</QuoteInner>
			</Card>
		</QuoteWrapper>
	);
};

const AbstractWrapper = styled.div`
	margin-top: 5rem;
`;

const Abstract = () => {
	const { t } = useI18n(I18n);

	return (
		<AbstractWrapper>
			<DescriptionText>
				{ t('abstract', { br: 'br' }) }
			</DescriptionText>
		</AbstractWrapper>
	);
};

const SectionAbstractWrapper = styled.section`
	padding-top: 15rem;
`;

export const SectionAbstract = () => {
	const { t } = useI18n(I18n);

	return (
		<SectionAbstractWrapper>
			<Container>
				<Profile />
				<Quote />
				<Abstract />
			</Container>
			<DividerIndex>{ t('index') }</DividerIndex>
			<Divider />
		</SectionAbstractWrapper>
	);
};
