declare module '*?asset' {
  const mod: {
    get use(): string;
    get url(): string;
  };

  export default mod;
}
