import { resolve } from 'node:path';
import simplei18n from '@simplei18n/core/vite';
import react from '@vitejs/plugin-react';
import wyw from '@wyw-in-js/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app'),
    },
  },
  plugins: [
    svgr(),
    wyw({
      eval: {
        strategy: 'static',
      },
    }),
    react(),
    simplei18n()
  ],
}));
