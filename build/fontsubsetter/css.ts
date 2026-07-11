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

export const buildFontVariableCss = (config: NormalizedFontSubsetterConfig): string => {
  const fontVariables = Object.keys(config.fonts)
    .map(
      fontName =>
        `  --font-${fontName}: ${buildFontStack(config.fonts[fontName], config.fontFaces)};`,
    )
    .join('\n');

  return `:root {\n${fontVariables}\n}`;
};

export const buildGeneratedFontCss = ({ config, fontAssets }: GeneratedFontCssInput): string => {
  const faces = fontAssets
    .map(asset =>
      [
        '@font-face {',
        `  font-family: ${cssString(toGeneratedFontFamily(asset.faceName))};`,
        `  src: url(${cssString(asset.url ?? asset.name)}) format("woff2");`,
        `  font-weight: ${asset.weight ?? 400};`,
        `  font-style: ${asset.style ?? 'normal'};`,
        `  font-display: ${asset.display ?? 'swap'};`,
        '}',
      ].join('\n'),
    )
    .join('\n\n');

  return [faces, buildFontVariableCss(config)].filter(Boolean).join('\n\n');
};
