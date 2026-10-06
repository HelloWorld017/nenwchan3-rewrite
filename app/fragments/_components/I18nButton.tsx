import { IconGlobe } from '@/icons';
import { zLayer } from '@/styles';
import { styled } from '@linaria/react';
import { useI18n } from '@simplei18n/core/react';
import { useSetLanguage } from '../_providers/I18nProvider';

const LanguageButtonWrapper = styled.button`
  position: absolute;
  top: 3rem;
  right: 3rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 2rem;
  color: var(--grey-900);
  font-family: var(--font-sans);
  font-size: 2rem;
  z-index: ${zLayer.overlay};
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

export const I18nButton = () => {
  const { lang, ts } = useI18n();
  const setLanguage = useSetLanguage();
  const nextLanguage = lang === 'ko' ? 'en' : 'ko';

  return (
    <LanguageButtonWrapper type="button" onClick={() => setLanguage(nextLanguage)}>
      <IconGlobe />
    </LanguageButtonWrapper>
  );
};
