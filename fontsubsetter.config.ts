import { AppFrame } from './app/App';
import { defineFontSubsetterConfig } from './build/fontsubsetter';

export default defineFontSubsetterConfig({
  include: [
    './app/fragments/**/*.tsx',
  ],
  frame: AppFrame,
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
    'Metropolis': {
      src: 'Metropolis-Bold.woff2',
      weight: 700,
    },
    'Iosevka': {
      src: 'Iosevka-Medium.woff2',
      weight: 500,
    },
  },
});
