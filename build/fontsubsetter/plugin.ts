import { loadFontSubsetterConfig } from './collect';
import { findFontSubsetterConfig, defineFontSubsetterConfig } from './config';
import { buildGeneratedFontCss } from './css';
import { getTofuFont } from './subset';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';

export { defineFontSubsetterConfig };
export type { FontFaceDefinition, FontSubsetterConfig, FontSubsetterOverride } from './types';

const virtualModuleId = 'virtual:fontsubsetter';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;
const registryKey = 'fontsubsetter.registry';

type DevGenerated = {
  css: string;
  assets: Map<string, Uint8Array>;
};

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
  let resolvedConfig: ResolvedConfig;
  let configFilePromise: Promise<string | undefined> | undefined;
  let devGenerated: DevGenerated | undefined;
  let devGenerating: Promise<DevGenerated> | undefined;

  const getConfigFile = () => {
    configFilePromise ??= findFontSubsetterConfig(resolvedConfig.root);
    return configFilePromise;
  };

  const generateDev = async (server: ViteDevServer): Promise<DevGenerated> => {
    const configFile = await getConfigFile();
    if (!configFile) {
      return { css: '', assets: new Map() };
    }

    const { config } = await loadFontSubsetterConfig({ server, configFile });
    const tofu = await getTofuFont();
    const tofuName = `${config.name}-adobe-blank.woff`;
    const tofuUrl = `/@fontsubsetter/assets/${tofuName}`;

    return {
      css: buildGeneratedFontCss({
        config,
        fontAssets: [],
        tofuUrl,
        development: true,
      }),
      assets: new Map([[tofuUrl, tofu]]),
    };
  };

  const invalidateDev = () => {
    devGenerated = undefined;
    devGenerating = undefined;
  };

  return {
    name: 'fontsubsetter',
    enforce: 'post',

    configResolved(config) {
      resolvedConfig = config;
    },

    configureServer(server) {
      server.watcher.on('change', invalidateDev);
      server.watcher.on('add', invalidateDev);
      server.watcher.on('unlink', invalidateDev);

      server.middlewares.use((request, response, next) => {
        void (async () => {
          if (!request.url?.startsWith('/@fontsubsetter/')) {
            next();
            return;
          }

          try {
            devGenerating ??= generateDev(server);
            devGenerated = await devGenerating;

            if (request.url.endsWith('.css')) {
              response.setHeader('Content-Type', 'text/css; charset=utf-8');
              response.end(devGenerated.css);
              return;
            }

            const asset = devGenerated.assets.get(request.url);
            if (asset) {
              response.setHeader('Content-Type', 'font/woff');
              response.end(Buffer.from(asset));
              return;
            }

            next();
          } catch (error) {
            next(error);
          }
        })();
      });
    },

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }

      return undefined;
    },

    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return undefined;
      }

      return process.env.FONT_SUBSETTER_INTERNAL === '1'
        ? buildRegistryRuntime()
        : buildNoopRuntime();
    },

    async transformIndexHtml() {
      if (process.env.FONT_SUBSETTER_INTERNAL === '1' || resolvedConfig.command !== 'serve') {
        return undefined;
      }

      const configFile = await getConfigFile();
      if (!configFile) {
        return undefined;
      }

      return [
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: '/@fontsubsetter/fontsubsetter.css',
          },
          injectTo: 'head',
        },
      ];
    },
  };
};

export default fontsubsetter;
