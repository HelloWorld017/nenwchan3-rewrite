import EmojiAirplane from '@/assets/icons/EmojiAirplane.svg?react';
import EmojiBlueBook from '@/assets/icons/EmojiBlueBook.svg?react';
import EmojiHighVoltage from '@/assets/icons/EmojiHighVoltage.svg?react';
import { Container } from '@/fragments/_components/Container';
import { SectionTitle } from '@/fragments/_components/SectionTitle';
import { IconCodeXml, IconServer } from '@/icons';
import { formatDateYearMonth } from '@/utils/format/formatDate';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { ReactNode, useMemo } from 'react';

defineI18n(
  yaml => yaml`
    # scope: activities
    org:
      ridi: 'RIDI'
      ridi.description: '리디 주식회사'
      sparcs: 'SPARCS'
      sparcs.description: '교내 서비스 개발 동아리'
      ifteam: 'if-Team, <Light>Organic</Light>'
      ifteam.description: '청소년 개발팀'

    role:
      frontend_engineer: '프론트엔드 엔지니어'
      frontend_lead: '프론트엔드 리드'
      fullstack_developer: '풀스택 개발자'
      team_lead: '팀장'

    team:
      ridi.web: '웹팀'
      sparcs:
        newara: '교내 커뮤니티 개발팀'
        geoul: '카이스트 미러팀'
        wheel: '서버 관리팀'
  `,
);

const ActivityRoleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 12rem;
  flex: 1;

  background: var(--bluegrey-900);
  border-radius: 2rem;
  color: var(--bluegrey-600);
  padding: 1.6rem 2.8rem;
  padding-right: 3.6rem;
`;

const ActivityRoleIcon = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 2.8rem;
  flex: 1;
  margin-bottom: 1.2rem;
`;

const ActivityRoleTitle = styled.b`
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 2.2rem;
  white-space: nowrap;
`;

const ActivityRoleTeam = styled.span`
  color: var(--bluegrey-700);
  font-size: 1.4rem;
  line-height: 1.8rem;
  white-space: nowrap;
  margin-bottom: 0.2rem;
`;

type ActivityRoleProps = {
  title: ReactNode;
  team?: ReactNode;
  icon: ReactNode;
};

const ActivityRole = ({ title, team, icon }: ActivityRoleProps) => (
  <ActivityRoleWrapper>
    <ActivityRoleIcon>{icon}</ActivityRoleIcon>
    {team && <ActivityRoleTeam>{team}</ActivityRoleTeam>}
    <ActivityRoleTitle>{title}</ActivityRoleTitle>
  </ActivityRoleWrapper>
);

const ActivityItemWrapper = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 40rem;
`;

const ActivityItemIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 8rem;
`;

const ActivityItemTitle = styled.b`
  color: var(--grey-100);
  font-size: 4.8rem;
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 5.2rem;
  margin-top: 3.2rem;
`;

const ActivityItemTitleLight = styled.span`
  font-weight: 300;
`;

const ActivityItemDescription = styled.span`
  color: var(--grey-300);
  font-size: 2.4rem;
  font-weight: 500;
  line-height: 2.8rem;
  margin-top: 0.8rem;
`;

const ActivityItemDate = styled.span`
  color: var(--grey-600);
  font-size: 1.8rem;
  line-height: 2.2rem;
  margin-top: 0.2rem;
  letter-spacing: -0.02em;
`;

const ActivityItemRoles = styled.div`
  display: flex;
  gap: 0.8rem;
  align-self: stretch;
  margin-top: 3.6rem;
`;

type ActivityItemProps = {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  date: { startAt: string; endAt: string | null };
  children: { icon: ReactNode; team?: ReactNode; role: ReactNode }[];
};

const ActivityItem = ({ icon, title, description, date, children }: ActivityItemProps) => {
  const startDate = useMemo(() => new Date(date.startAt), [date.startAt]);
  const endDate = useMemo(() => date.endAt && new Date(date.endAt), [date.endAt]);

  return (
    <ActivityItemWrapper>
      <ActivityItemIcon>{icon}</ActivityItemIcon>
      <ActivityItemTitle>{title}</ActivityItemTitle>
      <ActivityItemDescription>{description}</ActivityItemDescription>
      <ActivityItemDate>
        <time dateTime={startDate.toUTCString()}>{formatDateYearMonth(startDate)}</time>
        {' ~ '}
        {endDate && (
          <time dateTime={new Date(endDate).toUTCString()}>{formatDateYearMonth(endDate)}</time>
        )}
      </ActivityItemDate>
      <ActivityItemRoles>
        {children.map(role => (
          <ActivityRole title={role.role} team={role.team} icon={role.icon} />
        ))}
      </ActivityItemRoles>
    </ActivityItemWrapper>
  );
};

const ActivityListWrapper = styled.ul`
  display: flex;
  gap: 8rem;
  margin-top: 4.8rem;
`;

const ActivityList = ({ children }: { children: ReactNode[] }) => (
  <Container>
    <ActivityListWrapper>{children}</ActivityListWrapper>
  </Container>
);

export const Activities = () => (
  <section>
    <Container>
      <SectionTitle>Activities</SectionTitle>
    </Container>
    <ActivityList>
      <ActivityItem
        icon={<EmojiBlueBook />}
        title={<t._>{t.activities.org.ridi}</t._>}
        description={<t._>{t.activities.org.ridi.description}</t._>}
        date={{ startAt: '2021-03', endAt: '2024-09' }}
      >
        {[
          {
            icon: <IconCodeXml />,
            team: <t._>{t.activities.team.ridi.web}</t._>,
            role: <t._>{t.activities.role.frontend_engineer}</t._>,
          },
        ]}
      </ActivityItem>
      <ActivityItem
        icon={<EmojiHighVoltage />}
        title={<t._>{t.activities.org.sparcs}</t._>}
        description={<t._>{t.activities.org.sparcs.description}</t._>}
        date={{ startAt: '2019-09', endAt: null }}
      >
        {{
          icon: <IconCodeXml />,
          team: <t._>{t.activities.team.sparcs.newara}</t._>,
          role: <t._>{t.activities.role.frontend_lead}</t._>,
        }}
        {{
          icon: <IconServer />,
          team: <t._>{t.activities.team.sparcs.geoul}</t._>,
          role: <t._>{t.activities.role.team_lead}</t._>,
        }}
        {{
          icon: <IconServer />,
          team: <t._>{t.activities.team.sparcs.wheel}</t._>,
          role: <t._>{t.activities.role.team_lead}</t._>,
        }}
      </ActivityItem>
      <ActivityItem
        icon={<EmojiAirplane />}
        title={<t._ $tags={{ Light: ActivityItemTitleLight }}>{t.activities.org.ifteam}</t._>}
        description={<t._>{t.activities.org.ifteam.description}</t._>}
        date={{ startAt: '2015-08', endAt: null }}
      >
        {[
          {
            icon: <IconCodeXml />,
            role: <t._>{t.activities.role.fullstack_developer}</t._>,
          },
        ]}
      </ActivityItem>
    </ActivityList>
  </section>
);
