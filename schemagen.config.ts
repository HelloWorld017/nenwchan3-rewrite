import { defineSchemaGenConfig } from './build/schemagen/index.ts';

export default defineSchemaGenConfig({
  include: './app/functions/**/*.ts',
  outFile: './app/schemas/index.ts',
  queryModule: './app/utils/query',
});
