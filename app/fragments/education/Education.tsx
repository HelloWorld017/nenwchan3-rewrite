import { Container } from '@/fragments/_components/Container';
import { HorizontalScrollContainer } from '@/fragments/_components/HorizontalScrollContainer';
import { SectionTitle } from '@/fragments/_components/SectionTitle';
import { formatDateYearMonth } from '@/utils/format/formatDate';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { type ReactNode, useMemo } from 'react';
import { addToFonts } from 'virtual:fontsubsetter';

defineI18n(
  yaml => yaml`
    # scope: education
    daedeok: '대덕고등학교'
    daedeok.major: '과학중점과정'
    kaist: '한국과학기술원'
    kaist.major: '전산학부'
  `,
);

const EducationItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  background: var(--bluegrey-900);
  border-radius: 2rem;
  padding: 2.4rem 3.2rem;
  padding-right: 6.4rem;
`;

const EducationItemTitle = styled.b`
  color: var(--bluegrey-600);
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 3.2rem;
  white-space: nowrap;
  margin-bottom: 1.2rem;
`;

const EducationItemDescription = styled.span`
  color: var(--bluegrey-600);
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.4rem;
  white-space: nowrap;
  margin-bottom: 0.2rem;
`;

const EducationItemDate = styled.span`
  color: var(--bluegrey-700);
  font-size: 1.6rem;
  line-height: 2rem;
  white-space: nowrap;
  letter-spacing: -0.02em;
`;

type EducationItemProps = {
  title: ReactNode;
  description: ReactNode;
  date: { startAt: string; endAt: string | null };
};

const EducationItem = ({ title, description, date }: EducationItemProps) => {
  const startDate = useMemo(() => new Date(date.startAt), [date.startAt]);
  const endDate = useMemo(() => date.endAt && new Date(date.endAt), [date.endAt]);

  return (
    <EducationItemWrapper>
      <EducationItemTitle>{title}</EducationItemTitle>
      <EducationItemDescription>{description}</EducationItemDescription>
      <EducationItemDate>
        <time dateTime={startDate.toUTCString()}>{formatDateYearMonth(startDate)}</time>
        {' ~ '}
        {endDate && (
          <time dateTime={new Date(endDate).toUTCString()}>{formatDateYearMonth(endDate)}</time>
        )}
      </EducationItemDate>
    </EducationItemWrapper>
  );
};

const scrollContainerStyle = css`
  margin-top: 4.8rem;
`;

const scrollContainerInnerStyle = css`
  gap: 2rem;
`;

const EducationList = ({ children }: { children: ReactNode[] }) => (
  <HorizontalScrollContainer
    className={scrollContainerStyle}
    innerClassName={scrollContainerInnerStyle}
  >
    {children}
  </HorizontalScrollContainer>
);

export const Education = () => (
  <section>
    <Container>
      <SectionTitle>Education</SectionTitle>
    </Container>
    <EducationList>
      <EducationItem
        title={<t._>{t.education.kaist}</t._>}
        description={<t._>{t.education.kaist.major}</t._>}
        date={{ startAt: '2019-03', endAt: null }}
      />
      <EducationItem
        title={<t._>{t.education.daedeok}</t._>}
        description={<t._>{t.education.daedeok.major}</t._>}
        date={{ startAt: '2017-03', endAt: '2019-02' }}
      />
    </EducationList>
  </section>
);

addToFonts(<Education />);
