const assetQuerySuffixes = ['?asset', '&asset'] as const;

export const resolveAssetRequest = (specifier: string): string | undefined => {
  const suffix = assetQuerySuffixes.find(candidate => specifier.endsWith(candidate));
  if (!suffix) {
    return undefined;
  }

  const source = specifier.slice(0, -suffix.length);
  return source.includes('?') ? source : `${source}?url`;
};
