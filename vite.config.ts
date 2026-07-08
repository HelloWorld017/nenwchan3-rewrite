import { resolve } from 'node:path';
import simplei18n from '@simplei18n/core/vite';
import react from '@vitejs/plugin-react';
import wyw from '@wyw-in-js/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import fontsubsetter from './build/fontsubsetter';

export default defineConfig(({ mode }) => {
  const resolveConfig = {
    alias: {
      '@': resolve(__dirname, 'app'),
    },
  };

  if (mode === 'backend') {
    return {
      build: {
        codeSplitting: false,
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, 'app/backend.ts'),
          fileName: () => 'backend.bundle.js',
          formats: ['es'],
        },
        minify: false,
        outDir: 'dist',
        target: 'es2022',
      },
      resolve: resolveConfig,
    };
  }

  return {
    build: {
      emptyOutDir: false,
      outDir: 'dist/static',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: resolveConfig,
    server: {
      port: 5174,
      proxy: {
        '/api': 'http://localhost:8787',
      },
    },
    plugins: [
      svgr(),
      wyw({
        eval: {
          strategy: 'hybrid',
        },
      }),
      react(),
      simplei18n(),
      fontsubsetter(),
    ],
  };
});
