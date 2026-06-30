import {styled} from '@linaria/react';
import { Sidebar } from './_components/Sidebar';
import { Abstract } from './abstract';
import { Introduction } from './introduction';
import {Projects} from './projects';

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15rem;
  padding-top: 15rem;
`;

const PageContents = () => (
  <>
    <Abstract />
    <Introduction />
    <SectionList>
      <Projects />
    </SectionList>
    <Sidebar />
  </>
);

export const Page = () => <PageContents />;
