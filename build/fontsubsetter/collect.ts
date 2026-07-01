import { dirname } from 'node:path';
import { glob } from 'tinyglobby';
import { isFontSubsetterConfig, normalizeFontSubsetterConfig } from './config';
import type {
  FontSubsetterConfig,
  FontSubsetterItem,
  NormalizedFontSubsetterConfig,
} from './types';
import type { ViteDevServer } from 'vite';

const registryKey = 'fontsubsetter.registry';

type Registry = {
  items: FontSubsetterItem[];
};

const getRegistry = (): Registry => {
  const globalWithRegistry = globalThis as typeof globalThis & {
    [registryKey]?: Registry;
  };

  globalWithRegistry[registryKey] ??= { items: [] };
  return globalWithRegistry[registryKey];
};

const resetFontSubsetterItems = (): void => {
  getRegistry().items = [];
};

const getFontSubsetterItems = (): FontSubsetterItem[] => [...getRegistry().items];

const resolveIncludeFiles = async (root: string, include: readonly string[]): Promise<string[]> =>
  glob([...include], {
    absolute: true,
    cwd: root,
    expandDirectories: false,
    onlyFiles: true,
  });

export type CollectedFontSubsetterConfig = {
  config: NormalizedFontSubsetterConfig;
  configDir: string;
  items: FontSubsetterItem[];
  files: string[];
};

const versionedId = (filePath: string): string =>
  `${filePath}?fontsubsetter=${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const loadAndCollect = async ({
  root,
  server,
  configFile,
}: {
  root: string;
  server: ViteDevServer;
  configFile: string;
}): Promise<CollectedFontSubsetterConfig> => {
  resetFontSubsetterItems();

  const configModule = (await server.ssrLoadModule(versionedId(configFile))) as {
    default?: FontSubsetterConfig;
  };
  if (!isFontSubsetterConfig(configModule.default)) {
    throw new Error('fontsubsetter.config must export a FontSubsetterConfig as default.');
  }

  const config = normalizeFontSubsetterConfig(configModule.default);
  const files = await resolveIncludeFiles(root, config.include);

  for (const file of files) {
    await server.ssrLoadModule(versionedId(file));
  }

  return {
    config,
    configDir: dirname(configFile),
    items: getFontSubsetterItems(),
    files,
  };
};
