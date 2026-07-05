declare module 'react' {
  interface CSSProperties {
    [index: `--${string}`]: number | string;
  }
}

export {};
