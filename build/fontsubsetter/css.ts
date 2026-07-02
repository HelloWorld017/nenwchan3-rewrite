import type { GeneratedFontCssInput, NormalizedFontSubsetterConfig } from './types';

const fontFamilyPrefix = '__fontsubsetter_';

export const toGeneratedFontFamily = (faceName: string): string => `${fontFamilyPrefix}${faceName}`;

export const fromGeneratedFontFamily = (family: string): string =>
  family.startsWith(fontFamilyPrefix) ? family.slice(fontFamilyPrefix.length) : family;

const genericFamilies = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
]);

const cssString = (value: string): string => JSON.stringify(value);

export const isGenericFamily = (family: string): boolean =>
  genericFamilies.has(family.trim().toLowerCase());

export const normalizeFamilyName = (family: string): string =>
  family.trim().replace(/^['"]|['"]$/g, '');

export const splitFontFamily = (fontFamily: string): string[] => {
  const families: string[] = [];
  let current = '';
  let quote: string | undefined;

  for (const char of fontFamily) {
    if ((char === '"' || char === "'") && !quote) {
      quote = char;
      current += char;
      continue;
    }

    if (char === quote) {
      quote = undefined;
      current += char;
      continue;
    }

    if (char === ',' && !quote) {
      const value = normalizeFamilyName(current);
      if (value) {
        families.push(value);
      }
      current = '';
      continue;
    }

    current += char;
  }

  const value = normalizeFamilyName(current);
  if (value) {
    families.push(value);
  }
  return families;
};

export const buildFontStack = (
  fonts: readonly string[],
  fontFaces: Record<string, unknown>,
): string => {
  const values: string[] = [];

  for (const family of fonts) {
    values.push(
      fontFaces[family]
        ? cssString(toGeneratedFontFamily(family))
        : !isGenericFamily(family)
          ? cssString(family)
          : family,
    );
  }

  return values.join(', ');
};

export const expandFontVariables = (
  config: NormalizedFontSubsetterConfig,
  fontFamily: string,
): string =>
  fontFamily.replace(/var\(\s*--font-([\w-]+)\s*\)/g, (_, fontName: string) =>
    buildFontStack(config.fonts[fontName], config.fontFaces),
  );

export const buildGeneratedFontCss = ({
  config,
  fontAssets,
}: GeneratedFontCssInput): string => {
  const fontFacesByName = new Map(fontAssets.map(asset => [asset.faceName, asset]));
  const faces = Object.entries(config.fontFaces)
    .flatMap(([faceName, definition]) => {
      const asset = fontFacesByName.get(faceName);
      if (!asset) {
        return [];
      }

      return [
        [
          '@font-face {',
          `  font-family: ${cssString(toGeneratedFontFamily(faceName))};`,
          `  src: url(${cssString(asset.url ?? asset.name)}) format("woff2");`,
          `  font-weight: ${definition.weight ?? 400};`,
          `  font-style: ${definition.style ?? 'normal'};`,
          `  font-display: ${definition.display ?? 'swap'};`,
          '}',
        ].join('\n'),
      ];
    })
    .join('\n\n');

  const fontVariables = Object.keys(config.fonts)
    .map(fontName => `  --font-${fontName}: ${buildFontStack(config.fonts[fontName], config.fontFaces)};`)
    .join('\n');

  return [faces, `:root {\n${fontVariables}\n}`].join('\n\n');
};
