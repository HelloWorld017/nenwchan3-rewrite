import { styled } from '@linaria/react';
import { Sidebar } from './_components/Sidebar';
import { Activities } from './activities';
import { Contact } from './contact';
import { Education } from './education';
import { Footer } from './footer';
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
  <div>
    <main>
      <Landing />
      <Profile />
      <Introduction />
      <Quote />
      <SectionList>
        <Projects />
        <Activities />
        <Education />
        <Contact />
      </SectionList>
    </main>
    <Footer />
    <Sidebar />
  </div>
);

export const Page = () => <PageContents />;
