import { AppStorage, response } from '@/utils/backend';
import { Hono } from 'hono';
import type { BackendBindings, BackendHandler } from '@/utils/backend';

const app = new Hono<{ Bindings: BackendBindings }>();
const mods = import.meta.glob<Record<string, unknown>>('./functions/**/*.ts', { eager: true });
const functions = Object.values(mods)
  .flatMap(mod => Object.values(mod))
  .filter(
    (value): value is BackendHandler => typeof value === 'object' && !!value && 'handle' in value,
  );

const invalidRequest = (issues: unknown) =>
  response({ ok: false, error: 'Invalid request', issues }, { status: 400 });

for (const mod of functions) {
  app[mod.method](mod.path, async c => {
    const request = {};

    if (mod.request?.query) {
      const query = Object.fromEntries(new URL(c.req.url).searchParams.entries());
      const result = await mod.request.query.safeParseAsync(query);

      if (!result.success) {
        return invalidRequest(result.error.issues);
      }

      Object.assign(request, { query: result.data });
    }

    if (mod.request?.body) {
      const body = await c.req.json().catch(() => undefined);
      const result = await mod.request.body.safeParseAsync(body);

      if (!result.success) {
        return invalidRequest(result.error.issues);
      }

      Object.assign(request, { body: result.data });
    }

    return mod.handle(c, request);
  });
}

export default app;
export { AppStorage };
