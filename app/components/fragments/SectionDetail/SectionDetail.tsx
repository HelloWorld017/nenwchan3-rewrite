import I18n from './SectionDetail.i18n.yml';
import { styled } from '@linaria/react';
import { useI18n } from '@simplei18n/react';
import { Container } from '@/components/common/Container';
import { Divider } from '@/components/common/Divider';
import { ReactComponent as EmojiAirplane } from '@/components/images/EmojiAirplane.svg';
import { ReactComponent as EmojiBlueBook } from '@/components/images/EmojiBlueBook.svg';
import { ReactComponent as EmojiBooks } from '@/components/images/EmojiBooks.svg';
import { ReactComponent as EmojiHighVoltageSign } from '@/components/images/EmojiHighVoltageSign.svg';
import { ReactComponent as EmojiWhiteFlower } from '@/components/images/EmojiWhiteFlower.svg';
import { ReactComponent as IconArrowRight } from '@/components/images/IconArrowRight.svg';
import { ReactComponent as IconGithub } from '@/components/images/IconGithub.svg';
import { ReactComponent as IconTelegram } from '@/components/images/IconTelegram.svg';
import { ReactComponent as IconMail } from '@/components/images/IconMail.svg';
import { Timeline, TimelineDate, TimelineItem, TimelineItemEntry } from '@/components/common/Timeline';
import type { ReactNode } from 'react';

const SectionDetailWrapper = styled.section`
	display: flex;
	flex-direction: column;
`;

const Lighten = styled.i`
	font-style: normal;
	font-weight: 300;
`;

const DetailHeader = styled.h2`
	color: var(--grey-100);
	font-size: 2.4rem;
	font-family: var(--font-display);
	font-weight: 700;
	text-transform: uppercase;
	margin-top: 12rem;
	margin-bottom: 4rem;
`;

type DetailTimelineItemProps = {
	itemKey: string,
	emoji: ReactNode,
	length: number,
	startDate: TimelineDate,
	endDate?: TimelineDate | string
};

const DetailTimelineItem = ({ itemKey, emoji, length, startDate, endDate }: DetailTimelineItemProps) => {
	const { t, ts } = useI18n(I18n);

	return (
		<TimelineItem
			startDate={ startDate }
			endDate={ endDate }
			title={ t(`${itemKey}.title`, { Lighten }) }
			description={ ts(`${itemKey}.description`) }
			emoji={ emoji }
		>
			{ [...Array(length)].map((_, index) => (
				<TimelineItemEntry key={ `role-${index}` }>
					{ t(`${itemKey}.roles.${index}`, { Lighten }) }
				</TimelineItemEntry>
			)) }
		</TimelineItem>
	);
};

const DetailActivities = () => {
	const { t } = useI18n(I18n);

	return (
		<>
			<DetailHeader>{ t('activities.title') }</DetailHeader>

			<Timeline>
				<DetailTimelineItem
					itemKey="activities.timeline.if-team"
					emoji={ <EmojiAirplane /> }
					startDate={{ year: 2017, month: 3 }}
					length={ 2 }
				/>

				<DetailTimelineItem
					itemKey="activities.timeline.sparcs"
					emoji={ <EmojiHighVoltageSign /> }
					startDate={{ year: 2019, month: 9 }}
					length={ 3 }
				/>

				<DetailTimelineItem
					itemKey="activities.timeline.ridi"
					emoji={ <EmojiBlueBook /> }
					startDate={{ year: 2021, month: 3 }}
					length={ 1 }
				/>
			</Timeline>
		</>
	);
};

const DetailEducation = () => {
	const { t, ts } = useI18n(I18n);

	return (
		<>
			<DetailHeader>{ t('education.title') }</DetailHeader>

			<Timeline>
				<DetailTimelineItem
					itemKey="education.timeline.daedeok"
					emoji={ <EmojiWhiteFlower /> }
					startDate={{ year: 2017, month: 3 }}
					endDate={{ year: 2019, month: 2 }}
					length={ 0 }
				/>

				<DetailTimelineItem
					itemKey="education.timeline.kaist"
					emoji={ <EmojiBooks /> }
					startDate={{ year: 2019, month: 3 }}
					endDate={ ts('education.timeline.kaist.status') }
					length={ 0 }
				/>
			</Timeline>
		</>
	);
};

const DetailContactItemIcon = styled(IconArrowRight)`
	margin-left: 1rem;
	transition: transform .4s ease;
`;

const DetailContactItemWrapper = styled.a`
	display: flex;
	align-items: center;
	color: var(--grey-100);
	font-family: var(--font-sans);
	font-size: 1.9rem;
	font-weight: 600;
	text-decoration: none;

	&:hover ${DetailContactItemIcon} {
		transform: translate(.4rem);
	}
`;

const DetailContactItemBadge = styled.div`
	display: inline-flex;
	width: 4.8rem;
	height: 4.8rem;
	margin-right: 2rem;

	justify-content: center;
	align-items: center;

	border-radius: 6px;
	box-shadow: var(--shadow-400);
	font-size: 2.5rem;
	color: var(--grey-900);
`;

type DetailContactItemProps = { icon: ReactNode, color: string, href: string, children: ReactNode };
const DetailContactItem = ({ icon, color, href, children }: DetailContactItemProps) => {
	return (
		<DetailContactItemWrapper href={ href } target="_blank">
			<DetailContactItemBadge style={{ background: color }}>
				{ icon }
			</DetailContactItemBadge>
			{ children }

			<DetailContactItemIcon />
		</DetailContactItemWrapper>
	)
};

const DetailContactItems = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	& > * {
		margin-top: 1rem;

		&:first-child {
			margin-top: 0;
		}
	}
`;

const DetailContact = () => {
	const { t } = useI18n(I18n);

	return (
		<>
			<DetailHeader>{ t('contact.title') }</DetailHeader>

			<DetailContactItems>
				<DetailContactItem
					icon={ <IconGithub /> }
					href="https://github.com/HelloWorld017"
					color={ 'var(--link-scheme-0)'}
				>
					{ t('contact.github') }
				</DetailContactItem>

				<DetailContactItem
					icon={ <IconTelegram /> }
					href="https://t.me/Khinenw"
					color={ 'var(--link-scheme-1)'}
				>
					{ t('contact.telegram') }
				</DetailContactItem>

				<DetailContactItem
					icon={ <IconMail /> }
					href="mailto:khi@nenw.dev"
					color={ 'var(--link-scheme-2)'}
				>
					{ t('contact.mail') }
				</DetailContactItem>
			</DetailContactItems>
		</>
	)
};

export const SectionDetail = () => {
	return (
		<SectionDetailWrapper id="Detail">
			<Container>
				<DetailActivities />
				<DetailEducation />
				<DetailContact />
			</Container>
			<Divider />
		</SectionDetailWrapper>
	);
}
