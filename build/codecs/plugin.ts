import type { Plugin } from 'vite';

const codecDefinitions = {
  av1: { type: 'video', mime: 'video/webm; codecs="av01"' },
  vp9: { type: 'video', mime: 'video/webm; codecs="vp9"' },
  h264: { type: 'video', mime: 'video/mp4; codecs="avc1"' },
} as const;

type CodecName = keyof typeof codecDefinitions;

type CodecCandidate = {
  name: CodecName;
  suffix: string;
};

type CodecsRequest = {
  candidates: CodecCandidate[];
  source: string;
};

type ResolvedCodecCandidate = {
  name: CodecName;
  source: string;
};

type SelectorPayload = {
  candidates: ResolvedCodecCandidate[];
};

const virtualSupportPrefix = 'virtual:codecs-supported-';
const resolvedVirtualSupportPrefix = `\x00${virtualSupportPrefix}`;
const resolvedSelectorPrefix = '\x00codecs:';
const codecsQueryPrefix = 'codecs=';
const suffixPattern = /^[\w.-]+$/;

const isCodecName = (name: string): name is CodecName => Object.hasOwn(codecDefinitions, name);

const parseCodecsRequest = (id: string): CodecsRequest | undefined => {
  const queryIndex = id.indexOf('?');
  if (queryIndex === -1) {
    return undefined;
  }

  const query = id.slice(queryIndex + 1);
  if (!query.startsWith(codecsQueryPrefix)) {
    return undefined;
  }

  const value = query.slice(codecsQueryPrefix.length);
  if (!value || value.includes('&')) {
    throw new Error(`Invalid codecs query in ${id}.`);
  }

  const candidates = value.replace(/\+(?:video)/, '').split(',').map(candidate => {
    const separatorIndex = candidate.indexOf(':');
    if (separatorIndex <= 0 || separatorIndex === candidate.length - 1) {
      throw new Error(`Invalid codec candidate ${JSON.stringify(candidate)} in ${id}.`);
    }

    const name = candidate.slice(0, separatorIndex);
    const suffix = candidate.slice(separatorIndex + 1);
    if (!isCodecName(name)) {
      throw new Error(`Unsupported codec ${JSON.stringify(name)} in ${id}.`);
    }

    if (!suffixPattern.test(suffix)) {
      throw new Error(`Invalid codec suffix ${JSON.stringify(suffix)} in ${id}.`);
    }

    return { name, suffix };
  });

  if (new Set(candidates.map(candidate => candidate.name)).size !== candidates.length) {
    throw new Error(`Duplicate codec names in ${id}.`);
  }

  return {
    candidates,
    source: id.slice(0, queryIndex),
  };
};

const createCodecSources = ({ candidates, source }: CodecsRequest): string[] => {
  const firstSuffix = `.${candidates[0].suffix}`;
  if (!source.endsWith(firstSuffix)) {
    throw new Error(`${source} must end with ${firstSuffix}.`);
  }

  const stem = source.slice(0, -firstSuffix.length);
  if (!stem) {
    throw new Error(`${source} must have a filename before ${firstSuffix}.`);
  }

  return candidates.map(candidate => `${stem}.${candidate.suffix}`);
};
const encodeSelectorPayload = (payload: SelectorPayload): string =>
  encodeURIComponent(JSON.stringify(payload));

const decodeSelectorPayload = (id: string): SelectorPayload =>
  JSON.parse(decodeURIComponent(id.slice(resolvedSelectorPrefix.length))) as SelectorPayload;

const renderCodecSupport = (name: CodecName): string => {
  const { mime, type } = codecDefinitions[name];
  if (type === 'video') {
    return [
      "export default typeof window === 'undefined'",
      '  ? false',
      `  : document.createElement('video').canPlayType(${JSON.stringify(mime)});`,
    ].join('\n');
  }

  throw new Error('Unsupported codec type');
};

const renderCodecSelector = (candidates: ResolvedCodecCandidate[]): string => {
  const lines: string[] = [];

  for (const [index, candidate] of candidates.entries()) {
    lines.push(`import asset_${index} from ${JSON.stringify(candidate.source)};`);
    if (index < candidates.length - 1) {
      lines.push(
        `import supported_${index} from ${JSON.stringify(`virtual:codecs-supported-${candidate.name}`)};`,
      );
    }
  }

  let selectedAsset = `asset_${candidates.length - 1}`;
  for (let index = candidates.length - 2; index >= 0; index -= 1) {
    selectedAsset = `supported_${index} ? asset_${index} : ${selectedAsset}`;
  }

  lines.push('', `export default ${selectedAsset};`);
  return lines.join('\n');
};

export const codecs = (): Plugin => ({
  name: 'codecs',
  enforce: 'pre',

  async resolveId(id, importer) {
    if (id.startsWith(resolvedVirtualSupportPrefix) || id.startsWith(resolvedSelectorPrefix)) {
      return id;
    }

    if (id.startsWith(virtualSupportPrefix)) {
      const name = id.slice(virtualSupportPrefix.length);
      if (!Object.hasOwn(codecDefinitions, name)) {
        throw new Error(`Unsupported codec ${JSON.stringify(name)}.`);
      }

      return `${resolvedVirtualSupportPrefix}${name}`;
    }

    const request = parseCodecsRequest(id);
    if (!request) {
      return undefined;
    }

    const sources = createCodecSources(request);
    const candidates: ResolvedCodecCandidate[] = [];
    for (const [index, source] of sources.entries()) {
      const resolved = await this.resolve(`${source}?url`, importer, { skipSelf: true });
      if (!resolved) {
        throw new Error(`Could not resolve codec asset ${source} from ${id}.`);
      }

      candidates.push({
        name: request.candidates[index].name,
        source: resolved.id,
      });
    }

    return `${resolvedSelectorPrefix}${encodeSelectorPayload({ candidates })}`;
  },

  load(id) {
    if (id.startsWith(resolvedVirtualSupportPrefix)) {
      return renderCodecSupport(id.slice(resolvedVirtualSupportPrefix.length) as CodecName);
    }

    if (id.startsWith(resolvedSelectorPrefix)) {
      return renderCodecSelector(decodeSelectorPayload(id).candidates);
    }

    return undefined;
  },
});

export default codecs;
