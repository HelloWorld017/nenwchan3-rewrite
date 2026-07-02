import {readFile} from 'node:fs/promises';
import { defineFontSubsetterConfig } from './config';
import type { Plugin } from 'vite';
import {fileURLToPath} from 'node:url';

export { defineFontSubsetterConfig };
export type { FontFaceDefinition, FontSubsetterConfig, FontSubsetterOverride } from './types';

const toResolvedId = (moduleId: string) => `\x00${moduleId}`;
const virtualModuleId = 'virtual:fontsubsetter';
const virtualTofuModuleId = 'virtual:fontsubsetter/tofu';
const virtualTofuFontModuleId = 'virtual:fontsubsetter/tofu-font';
const virtualModules = [virtualModuleId, virtualTofuModuleId, virtualTofuFontModuleId];

const registryKey = 'fontsubsetter.registry';

const buildRegistryRuntime = (): string =>
  [
    `const registryKey = ${JSON.stringify(registryKey)};`,
    'const getRegistry = () => {',
    '  globalThis[registryKey] ??= { items: [] };',
    '  return globalThis[registryKey];',
    '};',
    'export const addToFonts = (node, override) => {',
    '  getRegistry().items.push({ node, override });',
    '};',
  ].join('\n');

const buildNoopRuntime = (): string => 'export const addToFonts = () => {};';

const tofuFontBuffer = readFile(fileURLToPath(new URL('./assets/AdobeBlank.ttf.woff', import.meta.url)))
  .then(value => `export default "data:font/woff;base64,${value.toString('base64')}";`);

export const fontsubsetter = (): Plugin => {
  return {
    name: 'fontsubsetter',
    enforce: 'post',

    resolveId(id) {
      if (virtualModules.includes(id)) {
        return toResolvedId(id);
      }

      return undefined;
    },

    load(id) {
      if (id === toResolvedId(virtualTofuModuleId)) {
        return `
          @font-face {
            font-family: "__tofu";
            font-display: block;
            src: url('${virtualTofuFontModuleId}');
          }

          :root {
          }
        `;
      }

      if (id === toResolvedId(virtualTofuFontModuleId)) {
        return tofuFontBuffer;
      }

      if (id === `\x00${virtualModuleId}`) {
        return process.env.FONT_SUBSETTER_INTERNAL === '1'
          ? buildRegistryRuntime()
          : buildNoopRuntime();
      }
    },

    transformIndexHtml() {
    },
  };
};

export default fontsubsetter;
