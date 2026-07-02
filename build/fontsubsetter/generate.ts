import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadAndCollect, loadFontSubsetterConfig } from './collect';
import { findFontSubsetterConfig } from './config';
import { buildGeneratedFontCss } from './css';
import { collectFontChars } from './render';
import { collectFontCoverage, subsetFonts } from './subset';
import type { ViteDevServer } from 'vite';

export type PreparedFontSubsetterOutput = {
  configFile: string;
  outDir: string;
  cssFileName: string;
};

export type GeneratedFontSubsetterOutput = PreparedFontSubsetterOutput & {
  assets: string[];
};

export const prepareFontSubsetterOutput = async ({
  root,
  server,
}: {
  root: string;
  server: ViteDevServer;
}): Promise<PreparedFontSubsetterOutput> => {
  const configFile = await findFontSubsetterConfig(root);
  if (!configFile) {
    throw new Error('Could not find fontsubsetter.config.');
  }

  const { config } = await loadFontSubsetterConfig({ server, configFile });
  const outDir = config.outDir;
  const cssFileName = `${config.name}.css`;

  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, cssFileName), '');

  return { configFile, outDir, cssFileName };
};

export const generateFontSubsetterAssets = async ({
  root,
  server,
  configFile,
  cssText,
}: {
  root: string;
  server: ViteDevServer;
  configFile: string;
  cssText: string;
  outDir?: string;
}): Promise<GeneratedFontSubsetterOutput> => {
  const collected = await loadAndCollect({ root, server, configFile });
  const { config, configDir } = collected;
  const coverage = await collectFontCoverage({
    root,
    configDir,
    config,
  });
  const chars = collectFontChars(config, collected.items, cssText, false, coverage);
  const fontAssets = await subsetFonts({
    root,
    configDir,
    config,
    chars,
  });
  const cssFileName = `${config.name}.css`;

  const outDir = config.outDir;
  await rm(outDir, { recursive: true });
  await mkdir(outDir, { recursive: true });

  for (const asset of fontAssets) {
    await writeFile(resolve(outDir, asset.name), asset.source);
  }

  await writeFile(
    resolve(outDir, cssFileName),
    buildGeneratedFontCss({
      config,
      fontAssets,
      development: false,
    }),
  );

  return {
    configFile,
    outDir,
    cssFileName,
    assets: [cssFileName, ...fontAssets.map(asset => asset.name)],
  };
};
