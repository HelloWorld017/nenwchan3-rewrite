import type { BackendBindings } from './storage';
import type { Context } from 'hono';
import type { z } from 'zod';

export type BackendMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type RequestSchemas = {
  query?: z.ZodType;
  body?: z.ZodType;
};

export type RequestDataInput<TRequest extends RequestSchemas> = {
  [K in keyof TRequest]: TRequest[K] extends z.ZodType
    ? z.input<TRequest[K]>
    : never;
};

export type RequestDataOutput<TRequest extends RequestSchemas> = {
  [K in keyof TRequest]: TRequest[K] extends z.ZodType
    ? z.output<TRequest[K]>
    : never;
};

export type BackendHandler<TRequest extends RequestSchemas = any> = {
  method: BackendMethod;
  path: string;
  request?: TRequest;
  handle: (
    c: Context<{ Bindings: BackendBindings }>,
    request: RequestDataOutput<TRequest>,
  ) => Response | Promise<Response>;
};

export const route = <
  const TRequest extends RequestSchemas,
  const T extends BackendHandler<TRequest>
>(definition: T & { request?: TRequest }) => definition;

export const response = <T>(value: T, maybeInit?: ResponseInit): Response<T> =>
  Response.json(value, maybeInit) as Response<T>;
