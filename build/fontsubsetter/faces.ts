import type { FontFaceSourceDefinition, NormalizedFontSubsetterConfig } from './types.ts';

export type NormalizedFontFace = FontFaceSourceDefinition & {
  id: string;
  faceName: string;
  index: number;
};

type FontWeightRange = {
  min: number;
  max: number;
};

const defaultFontWeight = 400;

const normalizeWeightKeyword = (value: string): number | undefined => {
  switch (value.trim().toLowerCase()) {
    case 'normal':
      return 400;
    case 'bold':
      return 700;
    default:
      return undefined;
  }
};

const toFontWeightRange = (value: number | string | undefined): FontWeightRange => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { min: value, max: value };
  }

  if (typeof value === 'string') {
    const keyword = normalizeWeightKeyword(value);
    if (keyword !== undefined) {
      return { min: keyword, max: keyword };
    }

    const numbers = value.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    if (numbers.length >= 2) {
      return { min: Math.min(numbers[0], numbers[1]), max: Math.max(numbers[0], numbers[1]) };
    }
    if (numbers.length === 1) {
      return { min: numbers[0], max: numbers[0] };
    }
  }

  return { min: defaultFontWeight, max: defaultFontWeight };
};

const toRequestedFontWeight = (value: number | string | undefined): number => {
  const range = toFontWeightRange(value);

  return range.min;
};

const getWeightSortKey = (
  faceWeight: number | string | undefined,
  requestedWeight: number,
): [number, number] => {
  const range = toFontWeightRange(faceWeight);

  if (requestedWeight >= range.min && requestedWeight <= range.max) {
    return [0, range.max - range.min];
  }

  if (requestedWeight < 400) {
    return range.max < requestedWeight ? [1, -range.max] : [2, range.min];
  }

  if (requestedWeight <= 500) {
    if (range.min > requestedWeight && range.min <= 500) {
      return [1, range.min];
    }

    return range.max < requestedWeight ? [2, -range.max] : [3, range.min];
  }

  return range.min > requestedWeight ? [1, range.min] : [2, -range.max];
};

const normalizeFontStyle = (value: string | undefined): string =>
  (value || 'normal').trim().toLowerCase();

export const getFontFaces = (config: NormalizedFontSubsetterConfig): NormalizedFontFace[] =>
  Object.entries(config.fontFaces).flatMap(([faceName, definition]) => {
    const sources = Array.isArray(definition) ? definition : [definition];

    return sources.map((source, index) => ({
      ...source,
      id: `${faceName}\0${index}`,
      faceName,
      index,
    }));
  });

export const getBestFontFace = ({
  faces,
  fontWeight,
  fontStyle,
  hasGlyph,
}: {
  faces: readonly NormalizedFontFace[];
  fontWeight?: number | string;
  fontStyle?: string;
  hasGlyph: (face: NormalizedFontFace) => boolean;
}): NormalizedFontFace | undefined => {
  const requestedWeight = toRequestedFontWeight(fontWeight);
  const requestedStyle = normalizeFontStyle(fontStyle);
  const styledFaces = faces.filter(face => normalizeFontStyle(face.style) === requestedStyle);
  const candidates = (styledFaces.length ? styledFaces : faces)
    .filter(hasGlyph)
    .map(face => ({
      face,
      weightSortKey: getWeightSortKey(face.weight, requestedWeight),
    }))
    .sort(
      (left, right) =>
        left.weightSortKey[0] - right.weightSortKey[0] ||
        left.weightSortKey[1] - right.weightSortKey[1] ||
        left.face.index - right.face.index,
    );

  return candidates[0]?.face;
};
