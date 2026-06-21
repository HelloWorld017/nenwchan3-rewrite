import '@/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/fragments/app';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root container #root not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
