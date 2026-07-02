import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
// oxlint-disable-next-line import/no-unassigned-import
import './assets/fonts/generated/fontsubsetter.css';

const container = document.getElementById('app')!;
const isServerSideRendered = import.meta.env.RENDER_MODE === 'universal';
if (isServerSideRendered) {
  hydrateRoot(container, <App lang="ko" />);
} else {
  createRoot(container).render(<App lang="ko" />);
}
