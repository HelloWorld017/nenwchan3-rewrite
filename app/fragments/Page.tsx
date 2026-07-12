import { AssetsContext } from '@/assets';
import { styled } from '@linaria/react';
import { delay } from 'es-toolkit';
import { use, useEffect, useState } from 'react';
import { Cursor } from './_components/Cursor';
import { Loading } from './_components/Loading';
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
  <>
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
  </>
);

export const Page = () => {
  const loader = use(AssetsContext);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const loadPromise = loader.load((current, total) => {
      const nextProgress = Math.max(0, Math.min((current / total) * 100, 100));
      setProgress(nextProgress);
    });

    void Promise.all([loadPromise, delay(600)])
      .then(() => setIsLoaded(true))
      .then(() => delay(3000))
      .then(() => setShowOverlay(false));
  }, [loader]);

  return (
    <div>
      {isLoaded && <PageContents />}
      <Cursor />
      {showOverlay && <Loading complete={isLoaded} percent={progress} />}
    </div>
  );
};
