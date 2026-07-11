import { access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
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

export const normalizeFontSubsetterConfig = (
  config: FontSubsetterConfig,
  root: string,
): NormalizedFontSubsetterConfig => ({
  ...config,
  name: config.name ?? 'fontsubsetter',
  include: Array.isArray(config.include) ? [...config.include] : [config.include],
  outDir: resolve(root, config.outDir),
});

export const isFontSubsetterConfig = (value: unknown): value is FontSubsetterConfig => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const config = value as Partial<FontSubsetterConfig>;
  return Boolean(config.include && config.fonts && config.fontFaces);
};

export type LoadedFontSubsetterConfig = {
  config: NormalizedFontSubsetterConfig;
  configDir: string;
  configFile: string;
};

export const loadConfig = async (root: string): Promise<LoadedFontSubsetterConfig> => {
  const configFile = await findFontSubsetterConfig(root);
  if (!configFile) {
    throw new Error('Could not find fontsubsetter.config.');
  }

  const configModule = (await import(pathToFileURL(configFile).href)) as {
    default?: unknown;
  };

  if (!isFontSubsetterConfig(configModule.default)) {
    throw new Error('fontsubsetter.config must export a FontSubsetterConfig as default.');
  }

  return {
    config: normalizeFontSubsetterConfig(configModule.default, root),
    configDir: dirname(configFile),
    configFile,
  };
};
