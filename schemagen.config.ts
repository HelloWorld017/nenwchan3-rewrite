import { defineSchemaGenConfig } from './build/schemagen';

export default defineSchemaGenConfig({
  include: './app/functions/**/*.ts',
  outFile: './app/schema/index.ts',
  queryModule: './app/utils/query',
});
