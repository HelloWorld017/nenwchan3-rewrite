import { defineAssetGenConfig } from './build/assetgen/index.ts';

export default defineAssetGenConfig({
  include: './app/**/*.{ts,tsx}',
  outFile: './app/assets/index.tsx',
  loaderModule: './app/utils/assets',
  react: true,
});
