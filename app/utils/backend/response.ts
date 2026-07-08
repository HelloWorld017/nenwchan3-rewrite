import {Handler} from "hono";
import {BackendBindings} from "./storage";

export type BackendHandler = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  handle: Handler<{ Bindings: BackendBindings }>;
};

export const route = <const T extends BackendHandler>(route: T) => route;
export const response = <T>(value: T, maybeInit?: ResponseInit): Response<T> =>
  Response.json(value, maybeInit) as Response<T>;
