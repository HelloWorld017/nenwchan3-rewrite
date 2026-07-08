import type { Handler } from 'hono';
import type { BackendBindings } from '@/backend';

export class Counter {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(): Promise<Response> {
    const current = (await this.state.storage.get<number>('count')) ?? 0;
    const count = current + 1;

    await this.state.storage.put('count', count);

    return Response.json({ count });
  }
}

export const counter = (): Handler<{ Bindings: BackendBindings }> => async (c) => {
  const id = c.env.COUNTER.idFromName('global');
  const stub = c.env.COUNTER.get(id);
  return stub.fetch(c.req.raw);
};
