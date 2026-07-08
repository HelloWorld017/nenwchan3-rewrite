import { Hono } from 'hono';
import { Counter, counter } from './functions/counter';

export type BackendBindings = {
  COUNTER: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: BackendBindings }>();
app.post('/api/counter', counter());

export { Counter };
export default app;
