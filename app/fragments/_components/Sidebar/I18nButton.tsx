import { IconGlobe } from '@/icons';
import { styled } from '@linaria/react';
import { t, useI18n } from '@simplei18n/core/react';
import { useSetLanguage } from '@/fragments/_providers/I18nProvider';
import {defineI18n, LocaleKey} from '@simplei18n/core';
import i18n from '@/i18n';

defineI18n(
  yaml => yaml`
    lang: '한국어'
  `,
);

const LanguageButtonWrapper = styled.button`
  position: absolute;
  bottom: 4rem;
  left: 3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 2rem;
  color: var(--grey-900);
  font-family: var(--font-sans);
  font-size: 2rem;
  transition:
    background var(--transition-default),
    color var(--transition-default);

  &:hover {
    background: var(--grey-900);
    color: var(--grey-100);
  }

  &:focus-visible {
    outline: 0.2rem solid currentColor;
    outline-offset: 0.4rem;
  }
`;


const locales = Object.keys(i18n.locales) as LocaleKey[];

export const I18nButton = () => {
  const { lang } = useI18n();
  const setLanguage = useSetLanguage();
  const nextLanguage = locales[(locales.indexOf(lang) + 1) % locales.length];

  return (
    <LanguageButtonWrapper type="button" onClick={() => setLanguage(nextLanguage)}>
      <IconGlobe />
      <span>
        <t._>{t.lang}</t._>
      </span>
    </LanguageButtonWrapper>
  );
};
