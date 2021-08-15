import I18n from './SectionIntroduction.i18n.yml';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { useI18n } from '@simplei18n/react';
import { Container } from '@/components/common/Container';
import { Divider } from '@/components/common/Divider';
import { DividerIndex } from '@/components/common/DividerIndex';
import { ReactComponent as EmojiSparkles } from '@/components/images/EmojiSparkles.svg';
import type { ReactNode } from 'react';

const IntroductionWrapper = styled.div`
	margin-top: 150px;
`;

const IntroductionTitlePrefix = styled.span`
	display: block;
	font-weight: 300;
`;

const IntroductionTitleWrapper = styled.h2`
	margin-bottom: 2rem;
	font-size: 3.6rem;
	font-family: var(--font-display);
	font-weight: 700;
	line-height: 1em;
	text-transform: uppercase;
`;

const IntroductionTitle = ({ prefix, children }: { prefix: ReactNode, children: ReactNode }) => {
	return (
		<IntroductionTitleWrapper>
			<IntroductionTitlePrefix>{ prefix }</IntroductionTitlePrefix>
			{ children }
		</IntroductionTitleWrapper>
	);
};

const IntroductionDecorator = styled.figure`
	margin: 0;
	margin-top: 20px;
	margin-bottom: 40px;
`;

const IntroductionDescription = styled.p`
	max-width: 85rem;
	margin: 0;

	color: var(--grey-400);
	font-size: 2rem;
	line-height: 1.6em;
	word-break: keep-all;
`;

const DeveloperCodeWrapper = styled.code`
	display: inline-block;
	min-width: 50rem;
	margin-top: 2rem;
	margin-bottom: 4rem;
	padding: 2.4rem;

	background: var(--grey-200);
	border-radius: 5px;
	color: var(--grey-900);
	font-size: 2.2rem;
	font-family: var(--font-code);
`;

const DeveloperCode = () => {
	const { t } = useI18n(I18n);

	return (
		<DeveloperCodeWrapper>
			{ t('developer.code', {
				str: ({ children }) => <span className={ css`color: var(--blue-400)`  }>{ children }</span>,
				obj: ({ children }) => <span className={ css`color: var(--green-400)` }>{ children }</span>
			}) }
		</DeveloperCodeWrapper>
	);
};

const DeveloperIntroduction = () => {
	const { t } = useI18n(I18n);

	return (
		<IntroductionWrapper>
			<IntroductionTitle prefix={ t('developer.title.prefix') }>
				{ t('developer.title.content') }
			</IntroductionTitle>
			<IntroductionDecorator>
				<DeveloperCode />
			</IntroductionDecorator>
			<IntroductionDescription>
				{ t('developer.description', { b: 'b' }) }
			</IntroductionDescription>
		</IntroductionWrapper>
	);
};

const DesignerStars = () => <EmojiSparkles className={ css`font-size: 6rem;` } />;

const DesignerIntroduction = () => {
	const { t } = useI18n(I18n);

	return (
		<IntroductionWrapper>
			<IntroductionTitle prefix={ t('designer.title.prefix') }>
				{ t('designer.title.content') }
			</IntroductionTitle>
			<IntroductionDecorator>
				<DesignerStars />
			</IntroductionDecorator>
			<IntroductionDescription>
				{ t('designer.description', { b: 'b' }) }
			</IntroductionDescription>
		</IntroductionWrapper>
	);
};

const SectionIntroductionWrapper = styled.section`
	display: flex;
	flex-direction: column;
`;

export const SectionIntroduction = () => {
	const { t } = useI18n(I18n);
	return (
		<SectionIntroductionWrapper id="Introduction">
			<Container>
				<DeveloperIntroduction />
				<DesignerIntroduction />
			</Container>
			<DividerIndex>{ t('introduction') }</DividerIndex>
			<Divider />
		</SectionIntroductionWrapper>
	);
}
