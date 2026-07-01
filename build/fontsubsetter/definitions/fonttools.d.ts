declare module '@web-alchemy/fonttools' {
  export function subset(
    input: Buffer | Uint8Array,
    options: Record<string, unknown>,
  ): Promise<Buffer | Uint8Array>;
}
