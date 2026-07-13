declare module '*?asset' {
  const mod: {
    get use(): string;
    get url(): string;
  };

  export default mod;
}

declare module '*&asset' {
  const mod: {
    get use(): string;
    get url(): string;
  };

  export default mod;
}
