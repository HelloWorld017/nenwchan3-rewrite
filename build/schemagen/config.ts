import { access } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export type SchemagenConfig = {
  include: string | readonly string[];
  outFile: string;
  queryModule: string;
};

export type NormalizedSchemagenConfig = Omit<
  SchemagenConfig,
  'include' | 'outFile' | 'queryModule'
> & {
  include: string[];
  outFile: string;
  queryModule: string;
};

const configFileNames = [
  'schemagen.config.ts',
  'schemagen.config.tsx',
  'schemagen.config.js',
  'schemagen.config.mjs',
];

const normalizeModuleSpecifier = (specifier: string, root: string): string => {
  if (specifier.startsWith('.')) {
    return resolve(root, specifier);
  }

  return isAbsolute(specifier) ? specifier : specifier;
};

export const findSchemagenConfig = async (root: string): Promise<string | undefined> => {
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

export const defineSchemagenConfig = <T extends SchemagenConfig>(config: T): T => config;

export const normalizeSchemagenConfig = (
  config: SchemagenConfig,
  root: string,
): NormalizedSchemagenConfig => ({
  ...config,
  include: Array.isArray(config.include) ? [...config.include] : [config.include],
  outFile: resolve(root, config.outFile),
  queryModule: normalizeModuleSpecifier(config.queryModule, root),
});

export const isSchemagenConfig = (value: unknown): value is SchemagenConfig => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const config = value as Partial<SchemagenConfig>;
  return Boolean(config.include && config.outFile && config.queryModule);
};

export type LoadedSchemagenConfig = {
  config: NormalizedSchemagenConfig;
  configDir: string;
  configFile: string;
};

export const loadConfig = async (root: string): Promise<LoadedSchemagenConfig> => {
  const configFile = await findSchemagenConfig(root);
  if (!configFile) {
    throw new Error('Could not find schemagen.config.');
  }

  const configModule = (await import(pathToFileURL(configFile).href)) as {
    default?: unknown;
  };

  if (!isSchemagenConfig(configModule.default)) {
    throw new Error('schemagen.config must export a SchemagenConfig as default.');
  }

  return {
    config: normalizeSchemagenConfig(configModule.default, root),
    configDir: dirname(configFile),
    configFile,
  };
};
