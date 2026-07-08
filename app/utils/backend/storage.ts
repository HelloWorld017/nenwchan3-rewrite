export type BackendBindings = {
  STORAGE: DurableObjectNamespace;
};

type StorageRequest =
  | { operation: 'kv:get'; key: string }
  | { operation: 'kv:put'; key: string; value: unknown }
  | { operation: 'kv:delete'; key: string }
  | { operation: 'kv:list'; prefix?: string; limit?: number }
  | { operation: 'sql:exec'; query: string; bindings: unknown[] };

type StorageResponse<T> = { ok: true; value: T } | { ok: false; error: string };
type SqlValue = ArrayBuffer | string | number | null;

export class AppStorage {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const body = (await request.json()) as StorageRequest;

    try {
      switch (body.operation) {
        case 'kv:get':
          return json({ ok: true, value: await this.state.storage.get(body.key) });

        case 'kv:put':
          await this.state.storage.put(body.key, body.value);
          return json({ ok: true, value: undefined });

        case 'kv:delete':
          return json({ ok: true, value: await this.state.storage.delete(body.key) });

        case 'kv:list': {
          const entries = await this.state.storage.list({
            prefix: body.prefix,
            limit: body.limit,
          });

          return json({ ok: true, value: Object.fromEntries(entries) });
        }

        default: {
          const sql = this.state.storage.sql;
          const rows = sql.exec<Record<string, SqlValue>>(body.query, ...body.bindings).toArray();

          return json({ ok: true, value: rows });
        }
      }
    } catch (error) {
      return json({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export const storage = (env: BackendBindings, namespace = 'global') => {
  const id = env.STORAGE.idFromName(namespace);
  const stub = env.STORAGE.get(id);

  const send = async <T>(body: StorageRequest): Promise<T> => {
    const response = await stub.fetch('https://storage.local/', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as StorageResponse<T>;

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.value;
  };

  return {
    kv: {
      get: <T = unknown>(key: string) => send<T | undefined>({ operation: 'kv:get', key }),
      put: (key: string, value: unknown) => send<void>({ operation: 'kv:put', key, value }),
      delete: (key: string) => send<boolean>({ operation: 'kv:delete', key }),
      list: <T = unknown>(options: { prefix?: string; limit?: number } = {}) =>
        send<Record<string, T>>({
          operation: 'kv:list',
          prefix: options.prefix,
          limit: options.limit,
        }),
    },
    sql: {
      exec: <T extends Record<string, SqlValue> = Record<string, SqlValue>>(
        query: string,
        ...bindings: unknown[]
      ) => send<T[]>({ operation: 'sql:exec', query, bindings }),
    },
  };
};

const json = <T>(value: StorageResponse<T>) => Response.json(value);
