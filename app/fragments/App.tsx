import i18n from '@/i18n';
import { globalStyle } from '@/styles';
import { createI18nResource, I18nProvider } from '@simplei18n/core/react';
import { StrictMode, type PropsWithChildren } from 'react';
import { Page } from './Page';
import { QueryProvider } from './_providers/QueryProvider';
import type { LocaleKey } from '@simplei18n/core';

const i18nResources = createI18nResource(i18n);

type AppFrameProps = PropsWithChildren<{
  lang?: LocaleKey;
}>;

export const AppFrame = ({ children, lang = 'ko' }: AppFrameProps) => (
  <StrictMode>
    <QueryProvider>
      <I18nProvider lang={lang} resource={i18nResources}>
        <main className={globalStyle}>{children}</main>
      </I18nProvider>
    </QueryProvider>
  </StrictMode>
);

type AppProps = {
  lang: LocaleKey;
};

export const App = ({ lang }: AppProps) => (
  <AppFrame lang={lang}>
    <Page />
  </AppFrame>
);
