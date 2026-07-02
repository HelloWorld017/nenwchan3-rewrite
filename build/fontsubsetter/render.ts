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
import type {
  CollectedFontChars,
  FontCoverage,
  FontSubsetterItem,
  NormalizedFontSubsetterConfig,
} from './types';
import type { ComponentType, PropsWithChildren } from 'react';

const shouldCollectChar = (char: string): boolean =>
  char.charCodeAt(0) >= 0x20 || char === '\n' || char === '\t';

const addTextByFallback = (
  chars: CollectedFontChars,
  coverage: FontCoverage,
  fontFamily: string,
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
      const target = chars.get(faceName);

      if (!target) {
        if (isGenericFamily(family)) {
          break;
        }

        continue;
      }

      if (coverage.get(faceName)?.has(codePoint)) {
        target.add(char);
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
    getComputedStyle: (element: unknown) => { fontFamily: string };
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

  const chars: CollectedFontChars = new Map(
    Object.keys(config.fontFaces).map(faceName => [faceName, new Set<string>()]),
  );

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
    const fontFamily = expandFontVariables(config, style.fontFamily || 'sans-serif');
    addTextByFallback(chars, coverage, fontFamily, text);
  });

  return chars;
};
