import { css } from '@linaria/core';

export const globalStyle = css`
  :global() {
    *:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *)) {
      all: unset;
      display: revert;
    }

    *:where(:not(a, button, input, textarea)) {
      cursor: inherit;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :root {
      --font-sans: 'Pretendard JP', sans-serif;
      --font-letter: 'RIDIBatang', 'Pretendard JP', serif;
      --font-display: 'Metropolis', 'Pretendard JP', sans-serif;
      --font-code: 'Iosevka', 'Pretendard JP', monospace;

      --shadow-400: 0px 0.5rem 2rem rgba(0, 0, 0, 0.12);

      --transition-default: 0.4s ease;
      --transition-container: 0.6s ease;
      --transition-bounce: 0.4s cubic-bezier(0.74, -0.51, 0.46, 1.01);

      --syntax-scheme-0: #24cbd6;
      --syntax-scheme-1: #4fcf6c;

      --bluegrey-100: #323b42;
      --bluegrey-300: #455156;
      --bluegrey-600: #617374;
      --bluegrey-700: #a2adba;
      --bluegrey-800: #c9dbef;
      --bluegrey-900: #f0f9ff;

      --grey-100: #101010;
      --grey-200: #202020;
      --grey-300: #505050;
      --grey-400: #808080;
      --grey-600: #a0a0a0;
      --grey-700: #cbcbcb;
      --grey-800: #efefef;
      --grey-850: #f8f8f8;
      --grey-900: #ffffff;

      font-family: var(--font-sans);
      font-size: 10px;
      letter-spacing: -0.01em;
      list-style-type: none;
      scroll-behavior: smooth;
    }
  }
`;

export const hoverStyle = {
  'transition': 'opacity var(--transition-default)',

  '&:hover': {
    opacity: 0.7,
  },
};
