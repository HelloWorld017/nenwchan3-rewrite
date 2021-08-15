import { styled } from '@linaria/react';
import { useI18n } from '@simplei18n/react';
import { Container } from '@/components/common/Container';
import { Divider, DividerIndex } from '@/components/common/Divider';
import { TimelineItem, TimelineItemEntry } from '@/components/common/TimelineItem';

const SectionDetailWrapper = styled.section`
	display: flex;
	flex-direction: column;
`;

export const SectionDetail = () => {
	return (
		<SectionDetailWrapper id="Detail">
			<Container>
				<TimelineItem startDate="2017.03" title="if-Team" description="청소년 개발팀" emoji="">
					<TimelineItemEntry>풀스택 개발자</TimelineItemEntry>
				</TimelineItem>
			</Container>
			<DividerIndex>Detail</DividerIndex>
			<Divider />
		</SectionDetailWrapper>
	);
}
