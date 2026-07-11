import type { SchemaGenConfig } from './build/schemagen';

export default {
  include: './app/functions/**/*.ts',
  outFile: './app/schemas/index.ts',
  queryModule: './app/utils/query',
} satisfies SchemaGenConfig;
