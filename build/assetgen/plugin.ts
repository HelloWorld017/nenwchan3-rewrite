import { findAssetGenConfig, loadConfig } from './config';
import type { Plugin } from 'vite';

export type AssetGenPluginOptions = {
  loaderModule?: string;
};

const resolvedAssetPrefix = '\x00assetgen:';

export const assetgen = ({ loaderModule = '@/assets' }: AssetGenPluginOptions = {}): Plugin => {
  let react = false;

  return {
    name: 'assetgen',
    enforce: 'pre',

    async configResolved(config) {
      if (await findAssetGenConfig(config.root)) {
        react = (await loadConfig(config.root)).config.react;
      }
    },

    async resolveId(id, importer) {
      if (!id.endsWith('?asset')) {
        return undefined;
      }

      const source = id.slice(0, -'?asset'.length);
      const resolved = await this.resolve(source, importer, { skipSelf: true });
      if (!resolved) {
        return undefined;
      }

      return `${resolvedAssetPrefix}${resolved.id}`;
    },

    load(id) {
      if (!id.startsWith(resolvedAssetPrefix)) {
        return undefined;
      }

      const source = id.slice(resolvedAssetPrefix.length);
      const lines = [
        `import asset from ${JSON.stringify(`${source}?url`)};`,
        react
          ? `import loader, { AssetsContext } from ${JSON.stringify(loaderModule)};`
          : `import loader from ${JSON.stringify(loaderModule)};`,
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
