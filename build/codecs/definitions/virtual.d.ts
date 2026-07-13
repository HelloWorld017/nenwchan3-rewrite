declare module 'virtual:codecs-supported-*' {
  const supported: false | CanPlayTypeResult;

  export default supported;
}

declare module '*+video' {
  const url: string;
  export default url;
}
