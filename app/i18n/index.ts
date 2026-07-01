import { defineLocales } from '@simplei18n/core';
import defaultEn from './_locales/en.i18n.yaml';
import defaultKo from './_locales/ko.i18n.yaml';

export default defineLocales({
  locales: {
    en: defaultEn,
    ko: defaultKo,
  },
  defaultLocale: 'ko',
});
