import { css } from '@linaria/core';

export const globalStyles = css`
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
      --font-sans: 'Pretendard', sans-serif;
      --font-letter: 'RIDIBatang', 'Pretendard', serif;
      --font-display: 'Metropolis', 'Pretendard', sans-serif;
      --font-code: 'Iosevka', 'Pretendard', monospace;

      --syntax-scheme-0: #24cbd6;
      --syntax-scheme-1: #4fcf6c;

      --bluegrey-600: #617374;
      --bluegrey-800: #a2adba;
      --bluegrey-900: #c9dbef;

      --grey-100: #101010;
      --grey-200: #202020;
      --grey-280: #404040;
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
      scroll-behavior: smooth;
    }
  }
`;
