import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  CollectedFontChars,
  GeneratedFontAsset,
  NormalizedFontSubsetterConfig,
} from './types';

type FonttoolsModule = {
  subset: (
    input: Buffer | Uint8Array,
    options: Record<string, unknown>,
  ) => Promise<Buffer | Uint8Array>;
};

const hashText = (value: string): string =>
  createHash('sha256').update(value).digest('hex').slice(0, 10);

const sanitizeFileName = (value: string): string =>
  value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-|-$/g, '');

const resolveFontSource = (root: string, configDir: string, src: string): string => {
  if (/^https?:\/\//.test(src)) {
    return src;
  }

  if (isAbsolute(src)) {
    return src;
  }

  if (src.startsWith('.')) {
    return resolve(configDir, src);
  }

  return resolve(root, 'app/assets/fonts', src);
};

const readFontSource = async (root: string, configDir: string, src: string): Promise<Buffer> => {
  const resolved = resolveFontSource(root, configDir, src);

  if (/^https?:\/\//.test(resolved)) {
    const response = await fetch(resolved);
    if (!response.ok) {
      throw new Error(
        `Failed to download font ${resolved}: ${response.status} ${response.statusText}`,
      );
    }
    return Buffer.from(await response.arrayBuffer());
  }

  return readFile(resolved);
};

export const subsetFonts = async ({
  root,
  configDir,
  config,
  chars,
}: {
  root: string;
  configDir: string;
  config: NormalizedFontSubsetterConfig;
  chars: CollectedFontChars;
}): Promise<GeneratedFontAsset[]> => {
  const { subset } = (await import('@web-alchemy/fonttools')) as FonttoolsModule;
  const assets: GeneratedFontAsset[] = [];

  for (const [faceName, definition] of Object.entries(config.fontFaces)) {
    const text = Array.from(chars.get(faceName) ?? []).join('');
    if (!text) {
      continue;
    }

    const source = await readFontSource(root, configDir, definition.src);
    const output = await subset(source, {
      text,
      'flavor': 'woff2',
      'layout-features': '*',
      'desubroutinize': true,
      'no-hinting': true,
    });
    const name = `${config.name}-${sanitizeFileName(faceName)}-${hashText(`${definition.src}\0${text}`)}.woff2`;
    assets.push({ faceName, name, source: output });
  }

  return assets;
};

export const getTofuFont = (): Promise<Uint8Array> =>
  readFile(resolve(dirname(fileURLToPath(import.meta.url)), 'assets/AdobeBlank.ttf.woff'));
