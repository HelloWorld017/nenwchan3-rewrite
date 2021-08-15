import { styled } from '@linaria/react';
import { Children } from 'react';
import type { ReactNode } from 'react';

const TimelineItemColumn = styled.div`
	display: flex;
	flex-direction: column;
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

	&[data-is-dim] {
		color: var(--grey-300);
	}
`;

const TimelineItemEntries = styled.ul`
	display: flex;
	flex-direction: column;
	margin: 0;
	margin-top: 2rem;
	list-style: none;
`;

export const TimelineItemEntry = styled.li`
	padding: 0;
`;

type TimelineItemProps = {
	startDate: string,
	title: ReactNode,
	emoji: ReactNode,
	description: string,
	children?: ReactNode
};

export const TimelineItem = ({ startDate, title, emoji, description, children }: TimelineItemProps) => {
	const hasChildren = !!Children.count(children);

	return (
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
	)
}
