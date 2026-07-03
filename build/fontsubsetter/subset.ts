import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { getFontFaces } from './faces.ts';
import type {
  CollectedFontChars,
  FontCoverage,
  GeneratedFontAsset,
  NormalizedFontSubsetterConfig,
  FontSubsetOptions,
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

const stableJSONSerialize = (object: unknown): string =>
  JSON.stringify(object, (_, val) =>
    !!val && typeof val === 'object' && val.constructor === Object
      ? Object.keys(val)
          .sort()
          .reduce<Record<string, unknown>>((result, key) => {
            result[key] = val[key];
            return result;
          }, {})
      : (val as unknown),
  );

const defaultSubsetOptions: FontSubsetOptions = {
  'layout-features': '*',
};

const buildSubsetOptions = (text: string, subsetOptions: FontSubsetOptions | undefined) => ({
  ...defaultSubsetOptions,
  ...subsetOptions,
  text,
  flavor: 'woff2',
});

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
    const text = Array.from(chars.get(face.id) ?? [])
      .sort((a, b) => a.localeCompare(b))
      .join('');
    if (!text) {
      continue;
    }

    const source = await readFontSource(root, configDir, face.src);
    const subsetOptions = buildSubsetOptions(text, face.subsetOptions);
    const hash = createHash('sha256')
      .update(config.name)
      .update(source)
      .update(stableJSONSerialize(subsetOptions))
      .digest('base64url')
      .slice(0, 5);

    const name = `${sanitizeFileName(face.faceName.replace(/\s+/g, '_'))}_${hash}.woff2`;
    const outputPath = resolve(config.outDir, name);

    try {
      await access(outputPath);
      console.info(
        `Skipping ${face.faceName}@${face.weight ?? 'normal'},${face.style ?? 'normal'}`,
      );
      assets.push({
        faceName: face.faceName,
        name,
        weight: face.weight,
        style: face.style,
        display: face.display,
      });
      continue;
    } catch {
      // File does not exist yet, generate it below.
    }

    const output = await subset(source, subsetOptions);
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
