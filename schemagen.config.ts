import { defineSchemaGenConfig } from './build/schemagen/index';

export default defineSchemaGenConfig({
  include: './app/functions/**/*.ts',
  outFile: './app/schemas/index.ts',
  queryModule: './app/utils/query',
});
