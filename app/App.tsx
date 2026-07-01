import { createI18nResource, I18nProvider } from '@simplei18n/core/react';
import { StrictMode } from 'react';
import { Page } from './fragments/Page';
import i18n from './i18n';
import { globalStyle } from './styles';
import type { LocaleKey } from '@simplei18n/core';

type AppProps = {
  lang: LocaleKey;
};

const i18nResources = createI18nResource(i18n);

export const App = ({ lang }: AppProps) => (
  <StrictMode>
    <I18nProvider lang={lang} resource={i18nResources}>
      <main className={globalStyle}>
        <Page />
      </main>
    </I18nProvider>
  </StrictMode>
);
