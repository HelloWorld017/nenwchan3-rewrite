import { access } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export type AssetGenConfig = {
  include: string | readonly string[];
  outFile: string;
  loaderModule: string;
  react?: boolean;
};

export type NormalizedAssetGenConfig = Omit<
  AssetGenConfig,
  'include' | 'outFile' | 'loaderModule' | 'react'
> & {
  include: string[];
  outFile: string;
  loaderModule: string;
  react: boolean;
};

const configFileNames = [
  'assetgen.config.ts',
  'assetgen.config.tsx',
  'assetgen.config.js',
  'assetgen.config.mjs',
];

const normalizeModuleSpecifier = (specifier: string, root: string): string => {
  if (specifier.startsWith('.')) {
    return resolve(root, specifier);
  }

  return isAbsolute(specifier) ? specifier : specifier;
};

export const findAssetGenConfig = async (root: string): Promise<string | undefined> => {
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

export const normalizeAssetGenConfig = (
  config: AssetGenConfig,
  root: string,
): NormalizedAssetGenConfig => ({
  ...config,
  include: Array.isArray(config.include) ? [...config.include] : [config.include],
  outFile: resolve(root, config.outFile),
  loaderModule: normalizeModuleSpecifier(config.loaderModule, root),
  react: config.react ?? false,
});

export const isAssetGenConfig = (value: unknown): value is AssetGenConfig => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const config = value as Partial<AssetGenConfig>;
  return Boolean(
    config.include &&
    config.outFile &&
    config.loaderModule &&
    (config.react === undefined || typeof config.react === 'boolean'),
  );
};

export type LoadedAssetGenConfig = {
  config: NormalizedAssetGenConfig;
  configDir: string;
  configFile: string;
};

export const loadConfig = async (root: string): Promise<LoadedAssetGenConfig> => {
  const configFile = await findAssetGenConfig(root);
  if (!configFile) {
    throw new Error('Could not find assetgen.config.');
  }

  const configModule = (await import(pathToFileURL(configFile).href)) as {
    default?: unknown;
  };

  if (!isAssetGenConfig(configModule.default)) {
    throw new Error('assetgen.config must export an AssetGenConfig as default.');
  }

  return {
    config: normalizeAssetGenConfig(configModule.default, root),
    configDir: dirname(configFile),
    configFile,
  };
};
