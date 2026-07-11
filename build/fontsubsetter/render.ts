import { Window } from 'happy-dom';
import { createElement, Fragment } from 'react';
import { renderToString } from 'react-dom/server';
import {
  buildFontVariableCss,
  expandFontVariables,
  fromGeneratedFontFamily,
  isGenericFamily,
  splitFontFamily,
} from './css';
import { getBestFontFace, getFontFaces } from './faces';
import type { NormalizedFontFace } from './faces';
import type {
  CollectedFontChars,
  FontCoverage,
  FontSubsetterItem,
  NormalizedFontSubsetterConfig,
} from './types';
import type { ComponentType, PropsWithChildren } from 'react';

const shouldCollectChar = (char: string): boolean =>
  char.charCodeAt(0) >= 0x20 || char === '\n' || char === '\t';

const applyTextTransform = (text: string, textTransform: string | undefined): string => {
  const tokens = new Set((textTransform || 'none').trim().toLowerCase().split(/\s+/));

  if (tokens.has('uppercase')) {
    return text.toLocaleUpperCase();
  }
  if (tokens.has('lowercase')) {
    return text.toLocaleLowerCase();
  }
  if (tokens.has('capitalize')) {
    return text.replace(
      /(^|[^\p{L}\p{N}_])(\p{L})/gu,
      (_match: string, prefix: string, char: string) => `${prefix}${char.toLocaleUpperCase()}`,
    );
  }

  return text;
};

const addTextByFallback = (
  chars: CollectedFontChars,
  coverage: FontCoverage,
  facesByName: ReadonlyMap<string, readonly NormalizedFontFace[]>,
  fontFamily: string,
  fontWeight: number | string | undefined,
  fontStyle: string | undefined,
  text: string,
): void => {
  const families = splitFontFamily(fontFamily);

  for (const char of Array.from(text)) {
    if (!shouldCollectChar(char)) {
      continue;
    }

    const codePoint = char.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }

    for (const family of families) {
      const faceName = fromGeneratedFontFamily(family);
      const faces = facesByName.get(faceName);

      if (!faces) {
        if (isGenericFamily(family)) {
          break;
        }

        continue;
      }

      const face = getBestFontFace({
        faces,
        fontWeight,
        fontStyle,
        hasGlyph: candidate => coverage.get(candidate.id)?.has(codePoint) ?? false,
      });

      if (face) {
        chars.get(face.id)?.add(char);
        break;
      }
    }
  }
};

type HappyDomNode = {
  nodeType: number;
  childNodes: Iterable<HappyDomNode>;
  textContent?: string | null;
  parentElement?: unknown;
};

const walkTextNodes = (node: HappyDomNode, callback: (textNode: HappyDomNode) => void): void => {
  if (node.nodeType === 3) {
    callback(node);
    return;
  }

  for (const child of Array.from(node.childNodes)) {
    walkTextNodes(child, callback);
  }
};

export type CollectFontCharsInput = {
  config: NormalizedFontSubsetterConfig;
  frame?: ComponentType<PropsWithChildren>;
  items: readonly FontSubsetterItem[];
  cssText: string;
  coverage: FontCoverage;
};

export const collectFontChars = ({
  config,
  frame,
  items,
  cssText,
  coverage,
}: CollectFontCharsInput): CollectedFontChars => {
  const children = items.map((item, index) => {
    if (!item.override) {
      return createElement(Fragment, { key: index }, item.node);
    }

    return createElement(
      'span',
      {
        key: index,
        style: {
          fontFamily: item.override.fontFamily,
          fontWeight: item.override.fontWeight,
          fontStyle: item.override.fontStyle,
          textTransform: item.override.textTransform,
        },
      },
      item.node,
    );
  });

  const node = frame
    ? createElement(frame, undefined, ...children)
    : createElement(Fragment, undefined, ...children);

  const html = renderToString(node);
  const window = new Window() as unknown as {
    document: { write: (html: string) => void; body: HappyDomNode };
    getComputedStyle: (element: unknown) => {
      fontFamily: string;
      fontWeight?: string;
      fontStyle?: string;
      textTransform?: string;
    };
  };

  const document = window.document;
  document.write(
    `<!doctype html>
    <html>
      <head>
        <style>${buildFontVariableCss(config)}</style>
        <style>${cssText}</style>
      </head>
      <body>${html}</body>
    </html>`,
  );

  const faces = getFontFaces(config);
  const facesByName = new Map<string, NormalizedFontFace[]>();

  for (const face of faces) {
    facesByName.set(face.faceName, [...(facesByName.get(face.faceName) ?? []), face]);
  }

  const chars: CollectedFontChars = new Map(faces.map(face => [face.id, new Set<string>()]));

  walkTextNodes(document.body, textNode => {
    const text = textNode.textContent ?? '';
    if (!text) {
      return;
    }

    const parent = textNode.parentElement;
    if (!parent) {
      return;
    }

    const style = window.getComputedStyle(parent);
    const transformedText = applyTextTransform(text, style.textTransform);
    if (!style.fontFamily) {
      console.warn(`Cannot get font-family for text: ${transformedText}`);
    }

    const fontFamily = expandFontVariables(config, style.fontFamily || 'sans-serif');
    addTextByFallback(
      chars,
      coverage,
      facesByName,
      fontFamily,
      style.fontWeight,
      style.fontStyle,
      transformedText,
    );
  });

  return chars;
};
