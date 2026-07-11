import type { AssetGenConfig } from './build/assetgen';

export default {
  include: './app/**/*.{ts,tsx}',
  outFile: './app/assets/index.tsx',
  loaderModule: './app/utils/assets',
  react: true,
} satisfies AssetGenConfig;
