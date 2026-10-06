import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import i18n from '@/i18n';
import { createI18nResource, I18nProvider as SimpleI18nProvider } from '@simplei18n/core/react';
import { createContext, use, useEffect, useState } from 'react';
import type { LocaleKey } from '@simplei18n/core';
import type { PropsWithChildren } from 'react';

const i18nResources = createI18nResource(i18n);
const SetLanguageContext = createContext<((lang: LocaleKey) => void) | null>(null);

export const useSetLanguage = () => use(SetLanguageContext)!;
export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [lang, setLang] = useState(i18n.defaultLocale);
  useIsomorphicLayoutEffect(() => {
    const preferredLanguages = navigator.languages;
    const targetLang = preferredLanguages
      .map(preferredLang => preferredLang.split('-').at(0)!)
      .find(preferredLang => Object.hasOwn(i18n.locales, preferredLang));

    setLang(targetLang ?? 'en');
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <SetLanguageContext value={setLang}>
      <SimpleI18nProvider lang={lang} resource={i18nResources}>
        {children}
      </SimpleI18nProvider>
    </SetLanguageContext>
  );
};
