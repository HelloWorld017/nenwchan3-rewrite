import {readFile} from 'node:fs/promises';
import { defineFontSubsetterConfig, loadConfig } from './config';
import type { Plugin } from 'vite';
import {fileURLToPath} from 'node:url';
import {buildFontStack, isGenericFamily} from './css';

export { defineFontSubsetterConfig };
export type { FontFaceDefinition, FontSubsetterConfig, FontSubsetterOverride } from './types';

const toResolvedId = (moduleId: string) => `\x00${moduleId}`;
const virtualModuleId = 'virtual:fontsubsetter';
const virtualTofuModuleId = 'virtual:fontsubsetter/tofu.css';
const virtualTofuFontModuleId = 'virtual:fontsubsetter/tofu-font.woff';
const virtualModules = [virtualModuleId, virtualTofuModuleId, virtualTofuFontModuleId];

const tofuFontBuffer = readFile(fileURLToPath(new URL('./assets/AdobeBlank.ttf.woff', import.meta.url)))
  .then(value => `export default "data:font/woff;base64,${value.toString('base64')}";`);

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

export const fontsubsetter = (): Plugin => {
  return {
    name: 'fontsubsetter',
    enforce: 'post',

    resolveId(id) {
      const normalized = id.replace(/\?.*$/, '');
      if (virtualModules.includes(normalized)) {
        return toResolvedId(normalized);
      }

      return undefined;
    },

    async load(id) {
      if (id === toResolvedId(virtualTofuModuleId)) {
        const { config } = await loadConfig(this.environment.config.root);
        const fontVariables = Object.keys(config.fonts)
          .map(fontName => {
            const fontStack = buildFontStack(
              config.fonts[fontName].flatMap(font => isGenericFamily(font) ? ['__tofu', font] : font),
              config.fontFaces
            );
            return `  --font-${fontName}: ${fontStack} !important;`;
          })
          .join('\n');

        return `
          @font-face {
            font-family: "__tofu";
            font-display: block;
            src: url('${virtualTofuFontModuleId}');
          }

          :root {
            ${fontVariables}
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
      return [{ tag: 'script', attrs: { type: 'module', src: `/@id/${virtualTofuModuleId}` } }];
    },
  };
};

export default fontsubsetter;
