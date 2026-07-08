import { AppStorage } from '@/utils/backend';
import { Hono } from 'hono';
import type { BackendBindings, BackendHandler } from '@/utils/backend';


const app = new Hono<{ Bindings: BackendBindings }>();
const mods = import.meta.glob<Record<string, unknown>>('./functions/**/*.ts', { eager: true });
const functions = Object.values(mods)
  .flatMap(mod => Object.values(mod))
  .filter(
    (value): value is BackendHandler => typeof value === 'object' && !!value && 'handle' in value,
  );

for (const mod of functions) {
  app[mod.method](mod.path, mod.handle);
}

export default app;
export { AppStorage };
