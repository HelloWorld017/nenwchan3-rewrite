import { styled } from '@linaria/react';
import { Children } from 'react';
import type { ReactNode } from 'react';

const TimelineItemWrapper = styled.div`
	display: flex;
`;

const TimelineItemColumn = styled.div`
	display: flex;
	flex-direction: column;
`;

const TimelineDateWrapper = styled.span`
	color: var(--grey-400);
	font-family: var(--font-number);
	font-size: 1.8rem;
	font-weight: 700;
	line-height: 2.2rem;
	margin-top: .7rem;
`;

export type TimelineDate = { year: number, month: number };

type TimelineItemDateProps = { dateOrStatus: TimelineDate | string, suffix?: string };
const TimelineItemDate = ({ dateOrStatus, suffix }: TimelineItemDateProps) => {
	const dateChild = typeof dateOrStatus === 'string'
		? dateOrStatus
		: (
			<time dateTime={ `${dateOrStatus.year}-${dateOrStatus.month}` }>
				{ dateOrStatus.year }. { dateOrStatus.month.toString().padStart(2, '0') }.
			</time>
		);

	return (
		<TimelineDateWrapper>
			{ dateChild }
			{ suffix && ` ${suffix}` }
		</TimelineDateWrapper>
	);
}

const TimelineItemDot = styled.span`
	margin-left: 1.6rem;
	margin-right: 3.2rem;
	line-height: 3.6rem;

	&::after {
		content: '';
		display: inline-block;
		width: .8rem;
		height: .8rem;
		border-radius: .4rem;
		background: var(--grey-700);
	}
`;

const TimelineItemEmojiWrapper = styled.div`
	font-size: 3.6rem;
	margin: 0 1.6rem;
`;

const TimelineItemTitle = styled.h3`
	color: var(--grey-100);
	font-family: var(--font-display);
	font-size: 3.2rem;
	font-weight: 700;
	margin: 0;
`;

const TimelineItemDescription = styled.p`
	margin: 0;
	font-family: var(--font-sans);
	font-size: 1.8rem;
	font-weight: 700;

	&[data-is-dim="true"] {
		color: var(--grey-300);
	}
`;

const TimelineItemEntries = styled.ul`
	display: flex;
	flex-direction: column;
	margin: 0;
	margin-top: 2rem;
	padding: 0;
	list-style: none;
`;

export const TimelineItemEntry = styled.li`
	color: var(--grey-300);
	font-family: var(--font-display);
	font-size: 1.8rem;
	font-weight: 700;
	line-height: 2.4rem;
`;

type TimelineItemProps = {
	startDate: TimelineDate,
	endDate?: TimelineDate | string
	title: ReactNode,
	emoji: ReactNode,
	description: string,
	children?: ReactNode
};

export const TimelineItem = ({ startDate, endDate, title, emoji, description, children }: TimelineItemProps) => {
	const hasChildren = !!Children.count(children);

	return (
		<TimelineItemWrapper>
			<TimelineItemColumn>
				<TimelineItemDate dateOrStatus={ startDate } suffix="~" />
				{ endDate && <TimelineItemDate dateOrStatus={ endDate } /> }
			</TimelineItemColumn>

			<TimelineItemDot />

			<TimelineItemEmojiWrapper>
				{ emoji }
			</TimelineItemEmojiWrapper>

			<TimelineItemColumn>
				<TimelineItemTitle>{ title }</TimelineItemTitle>
				<TimelineItemDescription data-is-dim={ !hasChildren }>
					{ description }
				</TimelineItemDescription>

				{ hasChildren && (
					<TimelineItemEntries>
						{ children }
					</TimelineItemEntries>
				) }
			</TimelineItemColumn>
		</TimelineItemWrapper>
	)
}
