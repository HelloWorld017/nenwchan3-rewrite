#!/usr/bin/env node
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { glob } from 'tinyglobby';
import { build, createServer } from 'vite';
import { loadConfig } from './config';
import { buildGeneratedFontCss } from './css';
import { collectFontChars } from './render';
import { collectFontCoverage, subsetFonts } from './subset';
import type { ComponentType, PropsWithChildren } from 'react';
import type { FontSubsetterItem, NormalizedFontSubsetterConfig } from './types';
import type { ViteDevServer } from 'vite';

type Registry = {
  items: FontSubsetterItem[];
};

type CollectedFontSubsetterInput = {
  root: string;
  server: ViteDevServer;
  config: NormalizedFontSubsetterConfig;
  configDir: string;
};

type CollectedFontSubsetterItems = {
  frame?: ComponentType<PropsWithChildren>;
  items: FontSubsetterItem[];
};

type GeneratedFontSubsetterOutput = {
  outDir: string;
  assets: string[];
};

const registryKey = 'fontsubsetter.registry';

const parseArgs = (): { root: string } => {
  const args = process.argv.slice(2);
  let root = process.cwd();

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--root') {
      root = resolve(args[index + 1] ?? root);
      index += 1;
    }
  }

  return { root: resolve(root) };
};

const createInternalServer = (root: string): Promise<ViteDevServer> =>
  createServer({
    root,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  });

const extractCssText = (result: unknown): string => {
  const outputs = Array.isArray(result) ? result : [result];

  return outputs
    .flatMap(output => output.output)
    .flatMap(chunk => {
      if (chunk.type !== 'asset' || !chunk.fileName.endsWith('.css')) {
        return [];
      }

      return [String(chunk.source)];
    })
    .join('\n');
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

const splitFrameSpecifier = (specifier: string): { moduleId: string; exportName: string } => {
  const separator = specifier.lastIndexOf('#');
  if (separator === -1) {
    throw new Error(`fontsubsetter frame must use "path#export" syntax: ${specifier}`);
  }

  return {
    moduleId: specifier.slice(0, separator),
    exportName: specifier.slice(separator + 1) || 'default',
  };
};

const resolveFrameModuleId = (configDir: string, moduleId: string): string => {
  if (moduleId.startsWith('.')) {
    return resolve(configDir, moduleId);
  }

  return isAbsolute(moduleId) ? moduleId : moduleId;
};

const loadFrame = async ({
  server,
  config,
  configDir,
}: {
  server: ViteDevServer;
  config: NormalizedFontSubsetterConfig;
  configDir: string;
}): Promise<ComponentType<PropsWithChildren> | undefined> => {
  if (!config.frame) {
    return undefined;
  }

  const { moduleId, exportName } = splitFrameSpecifier(config.frame);
  const frameModule = await server.ssrLoadModule(resolveFrameModuleId(configDir, moduleId));
  const frame = frameModule[exportName];

  if (!frame) {
    throw new Error(`Could not find frame export "${exportName}" in ${moduleId}.`);
  }

  return frame as ComponentType<PropsWithChildren>;
};

const loadAndCollect = async ({
  root,
  server,
  config,
  configDir,
}: CollectedFontSubsetterInput): Promise<CollectedFontSubsetterItems> => {
  resetFontSubsetterItems();

  const files = await resolveIncludeFiles(root, config.include);
  for (const file of files) {
    await server.ssrLoadModule(file);
  }

  const items = getFontSubsetterItems();
  const frame = await loadFrame({ server, config, configDir });

  return { frame, items };
};

const generateFontSubsetterAssets = async ({
  root,
  server,
  config,
  configDir,
  cssText,
}: {
  root: string;
  server: ViteDevServer;
  config: NormalizedFontSubsetterConfig;
  configDir: string;
  cssText: string;
}): Promise<GeneratedFontSubsetterOutput> => {
  const collected = await loadAndCollect({ root, server, config, configDir });
  const coverage = await collectFontCoverage({ root, configDir, config });
  const chars = collectFontChars({
    config,
    frame: collected.frame,
    items: collected.items,
    cssText,
    coverage,
  });
  const fontAssets = await subsetFonts({ root, configDir, config, chars });
  const cssFileName = `${config.name}.css`;

  await rm(config.outDir, { recursive: true, force: true });
  await mkdir(config.outDir, { recursive: true });

  for (const asset of fontAssets) {
    await writeFile(resolve(config.outDir, asset.name), asset.source);
  }

  await writeFile(
    resolve(config.outDir, cssFileName),
    buildGeneratedFontCss({ config, fontAssets }),
  );

  return {
    outDir: config.outDir,
    assets: [cssFileName, ...fontAssets.map(asset => asset.name)],
  };
};

const withFontSubsetterInternal = async <T>(callback: () => Promise<T>): Promise<T> => {
  const previous = process.env.FONT_SUBSETTER_INTERNAL;
  process.env.FONT_SUBSETTER_INTERNAL = '1';

  try {
    return await callback();
  } finally {
    if (previous === undefined) {
      delete process.env.FONT_SUBSETTER_INTERNAL;
    } else {
      process.env.FONT_SUBSETTER_INTERNAL = previous;
    }
  }
};

const main = async (): Promise<void> => {
  const { root } = parseArgs();

  await withFontSubsetterInternal(async () => {
    const { config, configDir } = await loadConfig(root);
    const cssFileName = `${config.name}.css`;

    await mkdir(config.outDir, { recursive: true });
    await writeFile(resolve(config.outDir, cssFileName), '');

    const buildResult = await build({
      root,
      logLevel: 'error',
      build: { write: false },
    });
    const cssText = extractCssText(buildResult);
    const generateServer = await createInternalServer(root);

    try {
      const generated = await generateFontSubsetterAssets({
        root,
        server: generateServer,
        config,
        configDir,
        cssText,
      });

      process.stdout.write(
        `Generated ${generated.assets.length} fontsubsetter files in ${generated.outDir}\n`,
      );
    } finally {
      await generateServer.close();
    }
  });
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
