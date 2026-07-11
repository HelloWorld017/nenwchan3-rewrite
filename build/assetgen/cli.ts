import { resolve } from 'node:path';
import { loadConfig } from './config';
import { generateAssets } from './generate';

const parseArgs = (): { root: string } => {
  const args = process.argv.slice(2);
  let root = process.cwd();

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--root') {
      root = resolve(args[index + 1] ?? root);
      index += 1;
    }
  }

  return { root: resolve(root) };
};

const main = async (): Promise<void> => {
  const { root } = parseArgs();
  const { config } = await loadConfig(root);
  const generated = await generateAssets({ root, config });

  process.stdout.write(
    `Generated ${generated.assets.length} assetgen assets in ${generated.outFile}\n`,
  );
};

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
