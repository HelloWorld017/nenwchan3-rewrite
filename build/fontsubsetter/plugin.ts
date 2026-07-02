import { defineFontSubsetterConfig } from './config.ts';
import type { Plugin } from 'vite';

export { defineFontSubsetterConfig };
export type { FontFaceDefinition, FontSubsetterConfig, FontSubsetterOverride } from './types.ts';

const virtualModuleId = 'virtual:fontsubsetter';
const resolvedVirtualModuleId = `\x00${virtualModuleId}`;

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

export const fontsubsetter = (): Plugin => ({
  name: 'fontsubsetter',
  enforce: 'post',

  resolveId(id) {
    if (id === virtualModuleId) {
      return resolvedVirtualModuleId;
    }

    return undefined;
  },

  load(id) {
    if (id === resolvedVirtualModuleId) {
      return process.env.FONT_SUBSETTER_INTERNAL === '1'
        ? buildRegistryRuntime()
        : buildNoopRuntime();
    }

    return undefined;
  },
});

export default fontsubsetter;
