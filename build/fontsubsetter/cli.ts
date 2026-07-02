#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { build, createServer } from 'vite';
import type {
  GeneratedFontSubsetterOutput,
  PreparedFontSubsetterOutput,
} from './generate';
import type { ViteDevServer } from 'vite';

type GenerateModule = {
  prepareFontSubsetterOutput: (input: {
    root: string;
    server: ViteDevServer;
  }) => Promise<PreparedFontSubsetterOutput>;

  generateFontSubsetterAssets: (input: {
    root: string;
    server: ViteDevServer;
    configFile: string;
    cssText: string;
    outDir: string;
  }) => Promise<GeneratedFontSubsetterOutput>;
};

const generateModuleId = fileURLToPath(new URL('./generate.ts', import.meta.url));

const parseArgs = (): { root: string } => {
  const args = process.argv.slice(2);
  let root = process.cwd();

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--root') {
      root = args[index + 1] ?? root;
      index += 1;
    }
  }

  return { root };
};

const createInternalServer = (root: string): Promise<ViteDevServer> =>
  createServer({
    root,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  });

const extractCssText = (result: unknown): string => {
  const outputs = Array.isArray(result) ? result : [result];

  return outputs
    .flatMap(output => output.output)
    .flatMap(chunk => {
      if (chunk.type !== 'asset' || !chunk.fileName.endsWith('.css')) {
        return [];
      }

      return [String(chunk.source)];
    })
    .join('\n');
};

const withFontSubsetterInternal = async <T>(callback: () => Promise<T>): Promise<T> => {
  const previous = process.env.FONT_SUBSETTER_INTERNAL;
  process.env.FONT_SUBSETTER_INTERNAL = '1';

  try {
    return await callback();
  } finally {
    if (previous === undefined) {
      delete process.env.FONT_SUBSETTER_INTERNAL;
    } else {
      process.env.FONT_SUBSETTER_INTERNAL = previous;
    }
  }
};

const loadGenerateModule = async (server: ViteDevServer): Promise<GenerateModule> =>
  await server.ssrLoadModule(generateModuleId) as GenerateModule;

const main = async (): Promise<void> => {
  const { root } = parseArgs();

  await withFontSubsetterInternal(async () => {
    const prepareServer = await createInternalServer(root);
    const prepared = await (async () => {
      try {
        const { prepareFontSubsetterOutput } = await loadGenerateModule(prepareServer);
        return await prepareFontSubsetterOutput({ root, server: prepareServer });
      } finally {
        await prepareServer.close();
      }
    })();

    const buildResult = await build({
      root,
      logLevel: 'error',
      build: { write: false },
    });
    const cssText = extractCssText(buildResult);
    const generateServer = await createInternalServer(root);

    try {
      const { generateFontSubsetterAssets } = await loadGenerateModule(generateServer);
      const generated = await generateFontSubsetterAssets({
        root,
        server: generateServer,
        configFile: prepared.configFile,
        cssText,
        outDir: prepared.outDir,
      });

      process.stdout.write(
        `Generated ${generated.assets.length} fontsubsetter files in ${generated.outDir}\n`,
      );
    } finally {
      await generateServer.close();
    }
  });
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
