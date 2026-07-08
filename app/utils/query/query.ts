import type { BackendHandler, RequestDataInput } from '../backend';

type RequestArguments<T extends BackendHandler> =
  {} extends RequestDataInput<NonNullable<T['request']>>
    ? []
    : [RequestDataInput<NonNullable<T['request']>>];

const request = 
  <T extends BackendHandler>(method: T['method'], path: T['path']) =>
  (...[req]: RequestArguments<T>) =>
  async () => {
    const url = new URL(path, window.location.href);
    const init: RequestInit = {
      method: method.toUpperCase(),
    };

    const data = req as { query?: Record<string, string>; body?: unknown } | undefined;
    if (data?.query) {
      const searchParams = new URLSearchParams(data.query);
      url.search = new URLSearchParams([...url.searchParams, ...searchParams]).toString();
    }

    if (data?.body) {
      init.headers = { 'content-type': 'application/json' };
      init.body = JSON.stringify(data.body);
    }

    const response = await fetch(url, init) as Awaited<ReturnType<T['handle']>>;
    return response.json();
  };

export const query =
  <T extends BackendHandler>(method: T['method'], path: T['path']) =>
  (...req: RequestArguments<T>) => ({
    queryKey: [method, path, req],
    queryFn: request<T>(method, path)(...req),
  });

export const mutate =
  <T extends BackendHandler>(method: T['method'], path: T['path']) => ({
    mutationKey: [method, path],
    mutationFn: (...req: RequestArguments<T>) => request<T>(method, path)(...req)(),
  });
