import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { getFontFaces } from './faces.ts';
import type {
  CollectedFontChars,
  FontCoverage,
  GeneratedFontAsset,
  NormalizedFontSubsetterConfig,
} from './types.ts';

type FonttoolsModule = {
  subset: (
    input: Buffer | Uint8Array,
    options: Record<string, unknown>,
  ) => Promise<Buffer | Uint8Array>;
  ttx: (
    input: Buffer | Uint8Array | string | URL,
    options?: string[][],
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

const parseCmapCodePoints = (xml: string): Set<number> => {
  const codePoints = new Set<number>();
  const pattern = /<map\s+[^>]*code=["']0x([0-9a-fA-F]+)["'][^>]*>/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(xml))) {
    codePoints.add(Number.parseInt(match[1], 16));
  }

  return codePoints;
};

export const collectFontCoverage = async ({
  root,
  configDir,
  config,
}: {
  root: string;
  configDir: string;
  config: NormalizedFontSubsetterConfig;
}): Promise<FontCoverage> => {
  const { ttx } = (await import('@web-alchemy/fonttools')) as FonttoolsModule;
  const coverage = new Map<string, ReadonlySet<number>>();
  const coverageBySource = new Map<string, Promise<ReadonlySet<number>>>();

  for (const face of getFontFaces(config)) {
    const sourceCoverage =
      coverageBySource.get(face.src) ??
      (async () => {
        const source = await readFontSource(root, configDir, face.src);
        const cmap = await ttx(source, [['-q'], ['-t', 'cmap']]);

        return parseCmapCodePoints(Buffer.from(cmap).toString('utf8'));
      })();

    coverageBySource.set(face.src, sourceCoverage);
    coverage.set(face.id, await sourceCoverage);
  }

  return coverage;
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

  for (const face of getFontFaces(config)) {
    const text = Array.from(chars.get(face.id) ?? []).join('');
    if (!text) {
      continue;
    }

    const source = await readFontSource(root, configDir, face.src);
    const output = await subset(source, {
      text,
      'flavor': 'woff2',
      'layout-features': '*',
      'desubroutinize': true,
      'no-hinting': true,
    });
    const name = `${config.name}-${sanitizeFileName(face.faceName)}-${hashText(`${face.src}\0${text}`)}.woff2`;
    assets.push({
      faceName: face.faceName,
      name,
      weight: face.weight,
      style: face.style,
      display: face.display,
      source: output,
    });
  }

  return assets;
};
