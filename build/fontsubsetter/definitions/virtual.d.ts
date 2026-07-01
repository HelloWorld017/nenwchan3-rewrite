declare module 'virtual:fontsubsetter' {
  import type { FontSubsetterOverride } from './types';
  import type { ReactNode } from 'react';

  export function addToFonts(node: ReactNode, override?: FontSubsetterOverride): void;
}
