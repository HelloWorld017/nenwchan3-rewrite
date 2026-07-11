import { extname } from 'node:path';
import sharp from 'sharp';
import type { WebpOptions } from 'sharp';
import type { Plugin } from 'vite';

export type WebpPluginOptions = {
  extensions?: string[];
  webp?: WebpOptions;
};

const defaultExtensions = ['.jpeg', '.jpg', '.png'];

const normalizeExtension = (extension: string): string =>
  (extension.startsWith('.') ? extension : `.${extension}`).toLowerCase();

export const webp = ({
  extensions = defaultExtensions,
  webp: webpOptions = {},
}: WebpPluginOptions = {}): Plugin => {
  const supportedExtensions = new Set(extensions.map(normalizeExtension));

  return {
    name: 'webp',
    apply: 'build',
    enforce: 'post',

    async generateBundle(_, bundle) {
      type BundleAsset = Extract<(typeof bundle)[string], { type: 'asset' }>;
      const imageAssets = Object.entries(bundle).filter((entry): entry is [string, BundleAsset] => {
        const [fileName, output] = entry;
        return output.type === 'asset' && supportedExtensions.has(extname(fileName).toLowerCase());
      });

      const convertedAssets = await Promise.all(
        imageAssets.map(async ([fileName, asset]) => {
          const convertedFileName = fileName.slice(0, -extname(fileName).length) + '.webp';
          const source = Buffer.from(asset.source);
          const convertedSource = await sharp(source)
            .webp({ quality: 80, ...webpOptions })
            .toBuffer();

          return { asset, convertedFileName, convertedSource, fileName };
        }),
      );

      const convertedFileNames = new Set<string>();
      for (const { convertedFileName, fileName } of convertedAssets) {
        if (
          convertedFileNames.has(convertedFileName) ||
          (convertedFileName !== fileName && convertedFileName in bundle)
        ) {
          this.error(`Cannot convert ${fileName}: ${convertedFileName} already exists.`);
        }

        convertedFileNames.add(convertedFileName);
      }

      for (const { asset, convertedFileName, convertedSource } of convertedAssets) {
        asset.fileName = convertedFileName;
        asset.source = convertedSource;
      }

      const replacements = convertedAssets.sort(
        (left, right) => right.fileName.length - left.fileName.length,
      );

      const replaceAssetReferences = (source: string): string => {
        let result = source;
        for (const { convertedFileName, fileName } of replacements) {
          result = result.replaceAll(fileName, convertedFileName);
        }
        return result;
      };

      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') {
          output.code = replaceAssetReferences(output.code);
        } else if (typeof output.source === 'string') {
          output.source = replaceAssetReferences(output.source);
        }
      }
    },
  };
};
