import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { FontSubsetterConfig, NormalizedFontSubsetterConfig } from './types';

const configFileNames = [
  'fontsubsetter.config.ts',
  'fontsubsetter.config.tsx',
  'fontsubsetter.config.js',
  'fontsubsetter.config.mjs',
];

export const findFontSubsetterConfig = async (root: string): Promise<string | undefined> => {
  for (const fileName of configFileNames) {
    const filePath = resolve(root, fileName);

    try {
      await access(filePath);
      return filePath;
    } catch {
      // Try the next supported config file name.
    }
  }

  return undefined;
};

export const defineFontSubsetterConfig = <T extends FontSubsetterConfig>(config: T): T => config;

export const normalizeFontSubsetterConfig = (
  config: FontSubsetterConfig,
): NormalizedFontSubsetterConfig => ({
  ...config,
  name: config.name ?? 'fontsubsetter',
  include: Array.isArray(config.include) ? [...config.include] : [config.include],
});

export const isFontSubsetterConfig = (value: unknown): value is FontSubsetterConfig => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const config = value as Partial<FontSubsetterConfig>;
  return Boolean(config.include && config.fonts && config.fontFaces);
};
