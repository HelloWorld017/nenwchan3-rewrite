import type { Plugin } from 'vite';

export type AssetGenPluginOptions = {
  loaderModule?: string;
};

const resolvedAssetPrefix = '\x00assetgen:';

export const assetgen = ({ loaderModule = '@/assets' }: AssetGenPluginOptions = {}): Plugin => ({
  name: 'assetgen',
  enforce: 'pre',

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

    return [
      `import asset from ${JSON.stringify(`${source}?url`)};`,
      `import { loader } from ${JSON.stringify(loaderModule)};`,
      '',
      'export default () => loader.lookup(asset);',
    ].join('\n');
  },
});

export default assetgen;
