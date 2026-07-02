import type { FontSubsetterConfig } from './build/fontsubsetter';

export default {
  include: ['./app/fragments/**/*.tsx'],
  outDir: './app/assets/fonts/generated',
  frame: './app/App.tsx#AppFrame',
  fonts: {
    sans: ['Pretendard JP', 'sans-serif'],
    letter: ['RIDIBatang', 'cursive'],
    display: ['Metropolis', 'Pretendard JP', 'sans-serif'],
    code: ['Iosevka', 'Pretendard JP', 'monospace'],
  },
  fontFaces: {
    'Pretendard JP': {
      src: 'Pretendard-Variable.woff2',
      weight: '100 900',
    },
    'RIDIBatang': {
      src: 'RIDIBatang-Regular.woff2',
    },
    'Metropolis': [
      {
        src: 'Metropolis-Light.woff2',
        weight: 300,
      },
      {
        src: 'Metropolis-Regular.woff2',
        weight: 400,
      },
      {
        src: 'Metropolis-Medium.woff2',
        weight: 500,
      },
      {
        src: 'Metropolis-Bold.woff2',
        weight: 700,
      },
    ],
    'Iosevka': {
      src: 'Iosevka-Medium.woff2',
      weight: 500,
      subsetOptions: {
        'layout-features': 'kern',
      },
    },
  },
} satisfies FontSubsetterConfig;
