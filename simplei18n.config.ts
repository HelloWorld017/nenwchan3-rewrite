import { defineConfig } from '@simplei18n/core';

export default defineConfig({
  target: {
    include: ['./app/**/*.tsx'],
    outDir: './app/i18n',
    eager: true,
  },
  locales: ['en', 'ko'],
  defaultLocale: 'ko',
});
