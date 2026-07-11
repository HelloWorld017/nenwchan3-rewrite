import { createPromisePool } from '../promise/createPromisePool';

export const createAssetsLoader = () => {
  const assetsMap = new Map<string, string | null>();

  const add = (newAssets: string[]) => {
    newAssets.forEach(asset => assetsMap.set(asset, null));
  };

  const load = async (onProgress: (progress: number, total: number) => void) => {
    const assetsToLoad = Array.from(assetsMap.entries())
      .filter(([, blobUrl]) => blobUrl === null)
      .map(([key]) => key);

    await createPromisePool(
      (function* generateAssetLoader() {
        let count = 0;
        for (const asset of assetsToLoad) {
          yield fetch(asset)
            .then(res => res.blob())
            .then(blob => assetsMap.set(asset, URL.createObjectURL(blob)))
            .then(() => onProgress(++count, assetsToLoad.length));
        }
      })(),
    );
  };

  const lookup = (asset: string) => {
    const blob = assetsMap.get(asset);
    return blob || asset;
  };

  const dispose = () => {
    assetsMap.forEach(value => {
      if (value) {
        URL.revokeObjectURL(value);
      }
    });
  };

  return {
    add,
    load,
    lookup,
    dispose,
  };
};
