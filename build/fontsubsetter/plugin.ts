import { posix } from 'node:path';
import { createServer, type Plugin, type ResolvedConfig, type ViteDevServer } from 'vite';
import { loadAndCollect } from './collect';
import { findFontSubsetterConfig, defineFontSubsetterConfig } from './config';
import { buildGeneratedFontCss } from './css';
import { collectFontChars } from './render';
import { getTofuFont, subsetFonts } from './subset';

export { defineFontSubsetterConfig };
export type { FontFaceDefinition, FontSubsetterConfig, FontSubsetterOverride } from './types';

const virtualModuleId = 'virtual:fontsubsetter';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;
const registryKey = 'fontsubsetter.registry';

type DevGenerated = {
  css: string;
  assets: Map<string, Uint8Array>;
};

const getBundleCss = (bundle: Record<string, unknown>): string =>
  Object.values(bundle)
    .flatMap(chunk => {
      if (!chunk || typeof chunk !== 'object') {
        return [];
      }

      const asset = chunk as { type?: string; fileName?: string; source?: string | Uint8Array };
      if (
        asset.type !== 'asset' ||
        !asset.fileName?.endsWith('.css') ||
        typeof asset.source !== 'string'
      ) {
        return [];
      }

      return [asset.source];
    })
    .join('\n');

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

const toHtmlUrl = (base: string, fileName: string): string => {
  if (base === './' || base === '') {
    return fileName;
  }

  return `${base.replace(/\/$/, '')}/${fileName}`;
};

const injectCssIntoHtml = (html: string, href: string): string => {
  const link = `<link rel="stylesheet" href="${href}">`;

  if (html.includes(link)) {
    return html;
  }

  return html.includes('</head>')
    ? html.replace('</head>', `  ${link}\n  </head>`)
    : `${link}\n${html}`;
};

const withInternalServer = async <T>(
  root: string,
  configFile: string | false | undefined,
  callback: (server: ViteDevServer) => Promise<T>,
): Promise<T> => {
  const previous = process.env.FONT_SUBSETTER_INTERNAL;
  process.env.FONT_SUBSETTER_INTERNAL = '1';

  const server = await createServer({
    root,
    configFile,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  });

  try {
    return await callback(server);
  } finally {
    await server.close();

    if (previous === undefined) {
      delete process.env.FONT_SUBSETTER_INTERNAL;
    } else {
      process.env.FONT_SUBSETTER_INTERNAL = previous;
    }
  }
};

export const fontsubsetter = (): Plugin => {
  let resolvedConfig: ResolvedConfig;
  let configFilePromise: Promise<string | undefined> | undefined;
  let devGenerated: DevGenerated | undefined;
  let devGenerating: Promise<DevGenerated> | undefined;

  const getConfigFile = () => {
    configFilePromise ??= findFontSubsetterConfig(resolvedConfig.root);
    return configFilePromise;
  };

  const generateFromServer = async (
    server: ViteDevServer,
    cssText: string,
    development: boolean,
  ): Promise<DevGenerated> => {
    const configFile = await getConfigFile();
    if (!configFile) {
      return { css: '', assets: new Map() };
    }

    const collected = await loadAndCollect({ root: resolvedConfig.root, server, configFile });
    const chars = collectFontChars(collected.config, collected.items, cssText, development);
    const fontAssets = await subsetFonts({
      root: resolvedConfig.root,
      configDir: collected.configDir,
      config: collected.config,
      chars,
    });
    const assets = new Map(
      fontAssets.map(asset => [`/@fontsubsetter/assets/${asset.name}`, asset.source]),
    );
    const fontAssetsForCss = fontAssets.map(asset => ({
      ...asset,
      url: `/@fontsubsetter/assets/${asset.name}`,
    }));
    let tofuUrl: string | undefined;

    if (development) {
      const tofu = await getTofuFont();
      const tofuName = `${collected.config.name}-adobe-blank.woff`;
      tofuUrl = `/@fontsubsetter/assets/${tofuName}`;
      assets.set(tofuUrl, tofu);
    }

    return {
      css: buildGeneratedFontCss({
        config: collected.config,
        fontAssets: fontAssetsForCss,
        tofuUrl,
        development,
      }),
      assets,
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
            if (!devGenerated) {
              devGenerating ??= generateFromServer(server, '', true);
              devGenerated = await devGenerating;
            }

            if (request.url.endsWith('.css')) {
              response.setHeader('Content-Type', 'text/css; charset=utf-8');
              response.end(devGenerated.css);
              return;
            }

            const asset = devGenerated.assets.get(request.url);
            if (asset) {
              response.setHeader(
                'Content-Type',
                request.url.endsWith('.woff') ? 'font/woff' : 'font/woff2',
              );
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

      return resolvedConfig.command === 'serve' && process.env.FONT_SUBSETTER_INTERNAL !== '1'
        ? buildNoopRuntime()
        : buildRegistryRuntime();
    },

    async transformIndexHtml() {
      if (process.env.FONT_SUBSETTER_INTERNAL === '1') {
        return undefined;
      }

      const configFile = await getConfigFile();
      if (!configFile) {
        return undefined;
      }

      if (resolvedConfig.command !== 'serve') {
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

    async generateBundle(_, bundle) {
      if (process.env.FONT_SUBSETTER_INTERNAL === '1') {
        return;
      }

      const configFile = await getConfigFile();
      if (!configFile) {
        return;
      }

      const cssText = getBundleCss(bundle);

      await withInternalServer(resolvedConfig.root, resolvedConfig.configFile, async server => {
        const collected = await loadAndCollect({ root: resolvedConfig.root, server, configFile });
        const chars = collectFontChars(collected.config, collected.items, cssText, false);
        const fontAssets = await subsetFonts({
          root: resolvedConfig.root,
          configDir: collected.configDir,
          config: collected.config,
          chars,
        });

        const emittedFontFileNames = new Map(
          fontAssets.map(asset => [
            asset,
            this.getFileName(
              this.emitFile({ type: 'asset', name: asset.name, source: asset.source }),
            ),
          ]),
        );
        const fontAssetsForCss = fontAssets.map(asset => ({
          ...asset,
          url: posix.basename(emittedFontFileNames.get(asset) ?? asset.name),
        }));

        const cssReferenceId = this.emitFile({
          type: 'asset',
          name: `${collected.config.name}.css`,
          source: buildGeneratedFontCss({
            config: collected.config,
            fontAssets: fontAssetsForCss,
            development: false,
          }),
        });
        const cssFileName = this.getFileName(cssReferenceId);
        const href = toHtmlUrl(resolvedConfig.base, cssFileName);

        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'asset' && chunk.fileName.endsWith('.html')) {
            chunk.source = injectCssIntoHtml(String(chunk.source), href);
          }
        }
      });
    },
  };
};

export default fontsubsetter;
