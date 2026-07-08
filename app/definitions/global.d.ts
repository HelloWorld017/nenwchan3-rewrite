declare global {
  interface Response<T = unknown> {
    json(): Promise<T>;
  }
}

export {};
