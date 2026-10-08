import i18n from '@/i18n';
import { createI18nResource, I18nProvider } from '@simplei18n/core/react';
import { AppFrame } from '../App';
import type { LocaleKey } from '@simplei18n/core';
import type { PropsWithChildren } from 'react';

const i18nResources = createI18nResource(i18n);
const locales = Object.keys(i18n.locales) as LocaleKey[];

export const FontSubsetterFrame = ({ children }: PropsWithChildren) => (
  <AppFrame>
    {locales.map(lang => (
      <I18nProvider key={lang} lang={lang} resource={i18nResources}>
        <div lang={lang}>{children}</div>
      </I18nProvider>
    ))}
  </AppFrame>
);
