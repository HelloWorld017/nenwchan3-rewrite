import type { LocaleKey } from '@simplei18n/core';
import { I18nProvider } from '@simplei18n/core/react';
import { StrictMode } from 'react';
import { globalStyles } from './styles';

type AppProps = {
  lang: LocaleKey;
};

export const App = ({ lang }: AppProps) => (
  <StrictMode>
    <I18nProvider lang={lang}>
      <main className={globalStyles}>
        <IndexPage />
      </main>
    </I18nProvider>
  </StrictMode>
);
