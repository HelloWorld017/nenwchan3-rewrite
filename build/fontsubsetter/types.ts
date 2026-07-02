import type { ReactNode } from 'react';

export type FontSubsetterOverride = {
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  textTransform?: string;
};

export type FontSubsetterItem = {
  node: ReactNode;
  override?: FontSubsetterOverride;
};

export type FontSubsetOptions = Record<string, unknown>;

export type FontFaceSourceDefinition = {
  src: string;
  weight?: number | string;
  style?: string;
  display?: string;
  subsetOptions?: FontSubsetOptions;
};

export type FontFaceDefinition = FontFaceSourceDefinition | readonly FontFaceSourceDefinition[];

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
  weight?: number | string;
  style?: string;
  display?: string;
  source?: Uint8Array;
};

export type GeneratedFontCssInput = {
  config: NormalizedFontSubsetterConfig;
  fontAssets: GeneratedFontAsset[];
};
