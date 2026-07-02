import type { ReactNode } from 'react';

export type FontSubsetterOverride = {
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: string;
};

export type FontSubsetterItem = {
  node: ReactNode;
  override?: FontSubsetterOverride;
};

export type FontFaceDefinition = {
  src: string;
  weight?: number | string;
  style?: string;
  display?: string;
};

export type FontSubsetterConfig = {
  name?: string;
  include: string | readonly string[];
  outDir: string;
  frame?: string;
  fonts: Record<string, readonly string[]>;
  fontFaces: Record<string, FontFaceDefinition>;
};

export type NormalizedFontSubsetterConfig = Omit<FontSubsetterConfig, 'include'> & {
  name: string;
  include: string[];
};

export type CollectedFontChars = Map<string, Set<string>>;

export type FontCoverage = Map<string, ReadonlySet<number>>;

export type GeneratedFontAsset = {
  faceName: string;
  name: string;
  url?: string;
  source: Uint8Array;
};

export type GeneratedFontCssInput = {
  config: NormalizedFontSubsetterConfig;
  fontAssets: GeneratedFontAsset[];
};
