import { styled } from '@linaria/react';
import { Sidebar } from './_components/Sidebar';
import { Activities } from './activities';
import { Contact } from './contact';
import { Education } from './education';
import { Introduction } from './introduction';
import { Landing } from './landing';
import { Profile } from './profile';
import { Projects } from './projects';
import { Quote } from './quote';

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15rem;
  padding-top: 15rem;
  padding-bottom: 15rem;
`;

const PageContents = () => (
  <>
    <Landing />
    <Profile />
    <Quote />
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
