import type { SchemagenConfig } from './build/schemagen';

export default {
  include: './app/functions/**/*.ts',
  outFile: './app/schema/index.ts',
  queryModule: './app/utils/query',
} satisfies SchemagenConfig;
