import { findAssetGenConfig, loadConfig } from './config';
import { resolveAssetRequest } from './utils';
import type { NormalizedAssetGenConfig } from './config';
import type { Plugin } from 'vite';

const resolvedAssetPrefix = '\x00assetgen:';

const encodeAssetSource = (source: string): string => encodeURIComponent(source);
const decodeAssetSource = (id: string): string =>
  decodeURIComponent(id.slice(resolvedAssetPrefix.length));

export const assetgen = (): Plugin => {
  let assetGenConfig: NormalizedAssetGenConfig | null = null;

  return {
    name: 'assetgen',
    enforce: 'pre',

    async configResolved(config) {
      if (await findAssetGenConfig(config.root)) {
        assetGenConfig = (await loadConfig(config.root)).config;
      }
    },

    async resolveId(id, importer) {
      const request = resolveAssetRequest(id);
      if (!request) {
        return undefined;
      }

      const resolved = await this.resolve(request, importer, { skipSelf: true });
      if (!resolved) {
        return undefined;
      }

      return `${resolvedAssetPrefix}${encodeAssetSource(resolved.id)}`;
    },

    load(id) {
      if (!id.startsWith(resolvedAssetPrefix)) {
        return undefined;
      }

      const react = assetGenConfig!.react;
      const source = decodeAssetSource(id);
      const lines = [
        `import asset from ${JSON.stringify(source)};`,
        react
          ? `import loader, { AssetsContext } from ${JSON.stringify(assetGenConfig!.outFile)};`
          : `import loader from ${JSON.stringify(assetGenConfig!.outFile)};`,
      ];

      if (react) {
        lines.push("import { use } from 'react';");
      }

      lines.push(
        '',
        'export default {',
        '  get url() {',
        '    return loader.lookup(asset);',
        '  },',
      );

      if (react) {
        lines.push(
          '',
          '  get use() {',
          '    const assets = use(AssetsContext);',
          '    return assets.lookup(asset);',
          '  },',
        );
      }

      lines.push('};');
      return lines.join('\n');
    },
  };
};

export default assetgen;
