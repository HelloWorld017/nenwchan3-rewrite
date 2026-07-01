import { styled } from '@linaria/react';
import { Sidebar } from './_components/Sidebar';
import { Abstract } from './abstract';
import { Activities } from './activities';
import { Contact } from './contact';
import { Education } from './education';
import { Introduction } from './introduction';
import { Projects } from './projects';

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15rem;
  padding-top: 15rem;
  padding-bottom: 15rem;
`;

const PageContents = () => (
  <>
    <Abstract />
    <Introduction />
    <SectionList>
      <Projects />
      <Activities />
      <Education />
      <Contact />
    </SectionList>
    <Sidebar />
  </>
);

export const Page = () => <PageContents />;
