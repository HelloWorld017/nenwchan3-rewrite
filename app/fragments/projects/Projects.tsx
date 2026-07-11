import IconDatabaseSync from '@/assets/icons/IconDatabaseSync.svg?react';
import IconGitBranchWrench from '@/assets/icons/IconGitBranchWrench.svg?react';
import ImageIrodori from '@/assets/images/irodori.png?asset';
import ImageKaede from '@/assets/images/kaede.png?asset';
import ImageMidnightway from '@/assets/images/midnightway.png?asset';
import ImageToneMarble from '@/assets/images/tone-marble.png?asset';
import { Container } from '@/fragments/_components/Container';
import { useSize } from '@/hooks/useSize';
import { IconAudioWaveform, IconBookText, IconGhost, IconMoonStar, IconSnowflake } from '@/icons';
import { breakpoints, hoverStyle, zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { defineI18n } from '@simplei18n/core';
import { t } from '@simplei18n/core/react';
import { addToFonts } from 'virtual:fontsubsetter';
import { SectionTitle } from '../_components/SectionTitle';
import type { ReactNode } from 'react';

const GRID_STEP = 4;

defineI18n(
  yaml => yaml`
    # scope: projects
    description: |
      개인적으로 진행했던 사이드 프로젝트들 중 보여드리고 싶은 프로젝트들입니다.<br />
      더 많은 프로젝트들을 보시고 싶으시다면 <Link>개인 깃허브</Link>에 방문해주시면
      감사하겠습니다!
  `,
);

const ProjectItemWrapper = styled.li`
  position: relative;
`;

const ProjectItemMeasure = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: var(--grid-gap);
  gap: var(--grid-gap);

  &[data-is-measuring='true'] {
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
  }
`;

const ProjectItemImage = styled.div`
  width: 100%;
  height: 15rem;
  background: var(--bluegrey-900);
  background-size: cover;
  background-position: center;
  border-radius: 1.2rem;
`;

const ProjectItemContents = styled.a`
  display: flex;
  align-items: center;
  background: var(--bluegrey-900);
  border-radius: 1.2rem;
  padding: 2rem 2.4rem;
  gap: 1.8rem;
  transition: opacity var(--transition-default);

  ${hoverStyle};
`;

const ProjectItemIcon = styled.div`
  color: var(--bluegrey-100);
  display: flex;
  align-items: center;
  font-size: 4rem;

  @media (max-width: ${breakpoints.sm}px) {
    font-size: 3rem;
  }
`;

const ProjectItemContentsInner = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--bluegrey-100);
`;

const ProjectItemTitle = styled.b`
  font-family: var(--font-display);
  font-size: 2.4rem;
  line-height: 2.8rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const ProjectItemDescription = styled.span`
  color: var(--bluegrey-100);
  font-size: 1.8rem;
  line-height: 2.2rem;
  letter-spacing: -0.02em;
`;

type ProjectItemProps = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  image?: string;
  href?: string;
};

export const ProjectItem = ({
  icon,
  title,
  description,
  href = `https://github.com/HelloWorld017/${title}`,
  image,
}: ProjectItemProps) => {
  const [ref, size] = useSize();
  const span = (size && `span ${Math.round(size.height / GRID_STEP)}`) || undefined;

  return (
    <ProjectItemWrapper style={{ gridRow: span }}>
      <ProjectItemMeasure ref={ref}>
        {image && <ProjectItemImage style={{ backgroundImage: `url('${image}')` }} />}
        <ProjectItemContents href={href}>
          <ProjectItemIcon>{icon}</ProjectItemIcon>
          <ProjectItemContentsInner>
            <ProjectItemTitle>{title}</ProjectItemTitle>
            <ProjectItemDescription>{description}</ProjectItemDescription>
          </ProjectItemContentsInner>
        </ProjectItemContents>
      </ProjectItemMeasure>
    </ProjectItemWrapper>
  );
};

const ProjectsColumns = styled.ul`
  --grid-gap: 1.8rem;

  display: grid;
  grid-auto-flow: row dense;
  grid-auto-rows: ${GRID_STEP}px;
  grid-template-columns: repeat(4, 1fr);
  column-gap: var(--grid-gap);

  @media (max-width: ${breakpoints.xl}px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${breakpoints.lg}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.sm}px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ProjectDescription = styled.p`
  color: var(--bluegrey-300);
  font-size: 2rem;
  line-height: 2.8rem;
  margin-top: 2.8rem;
  margin-bottom: 4.8rem;
`;

const ProjectDescriptionLinkInner = styled.a`
  position: relative;
  color: var(--bluegrey-100);
  font-weight: 700;
  transition: opacity var(--transition-default);

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1rem;
    transform: translate(0.2rem, 0.1rem);
    background: var(--bluegrey-800);
    z-index: ${zLayer.below};
  }

  &::after {
    content: '↗';
  }

  ${hoverStyle};
`;

const ProjectDescriptionLink = ({ children }: { children?: ReactNode }) => (
  <ProjectDescriptionLinkInner href="https://github.com/HelloWorld017">
    {children}
  </ProjectDescriptionLinkInner>
);

export const Projects = () => (
  <section>
    <Container>
      <SectionTitle>Projects</SectionTitle>
      <ProjectDescription>
        <t._ $tags={{ br: 'br', Link: ProjectDescriptionLink }}>{t.projects.description}</t._>
      </ProjectDescription>
    </Container>

    <Container>
      <ProjectsColumns>
        <ProjectItem
          icon={<IconSnowflake />}
          title="devices"
          description="nix-based configurations"
        />
        <ProjectItem
          icon={<IconAudioWaveform />}
          title="tone-marble"
          description="an unrealistic instrument"
          image={ImageToneMarble.use}
        />
        <ProjectItem
          icon={<IconDatabaseSync />}
          title="clxdb"
          description="serverless synchronization engine"
        />
        <ProjectItem
          icon={<IconMoonStar />}
          title="midnightway"
          description="webkit-based wayland bar and panels"
          image={ImageMidnightway.use}
        />
        <ProjectItem
          icon={<IconGhost />}
          title="kaede"
          description="neat ghost theme"
          image={ImageKaede.use}
        />
        <ProjectItem
          icon={<IconBookText />}
          title="irodori"
          description="local-first diary app"
          image={ImageIrodori.use}
        />
        <ProjectItem
          icon={<IconGitBranchWrench />}
          title="kanrinin"
          description="CI/CD tool for small-scale nixos deployments"
        />
      </ProjectsColumns>
    </Container>
  </section>
);

addToFonts(<Projects />);
