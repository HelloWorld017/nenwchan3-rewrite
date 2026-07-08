import './assets/fonts/generated/fontsubsetter.css';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from '@/fragments/App';

const container = document.getElementById('app')!;
const isServerSideRendered = import.meta.env.RENDER_MODE === 'universal';
if (isServerSideRendered) {
  hydrateRoot(container, <App lang="ko" />);
} else {
  createRoot(container).render(<App lang="ko" />);
}
