import { response, route, storage } from '@/utils/backend';

export const getCounter = route({
  method: 'get',
  path: '/api/counter',
  async handle(c) {
    const kv = storage(c.env, 'counter').kv;
    const count = (await kv.get<number>('count')) ?? 0;

    return response({
      ok: true,
      count,
    });
  },
});

export const increaseCounter = route({
  method: 'post',
  path: '/api/counter',
  async handle(c) {
    const kv = storage(c.env, 'counter').kv;
    const current = (await kv.get<number>('count')) ?? 0;
    const count = current + 1;

    await kv.put('count', count);

    return response({
      ok: true,
      count,
    });
  },
});
