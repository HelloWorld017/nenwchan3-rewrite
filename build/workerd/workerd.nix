{ lib, stdenv, fetchurl, gzip, patchelf, zlib, openssl }:
let
  version = "1.20260707.1";

  sources = {
    x86_64-linux = {
      asset = "workerd-linux-64.gz";
      hash = "sha256-l6y19zht2PN3TOLKNSNrV5J5sBb7eWjIJZloL4KIAR8=";
    };

    aarch64-linux = {
      asset = "workerd-linux-arm64.gz";
      hash = "sha256-M7ci3eIc0P4aOnTdAtSx4wVqio2bkNRE6Lu4ed5NnVY=";
    };
  };

  srcInfo =
    sources.${stdenv.hostPlatform.system}
      or (throw "Unsupported system: ${stdenv.hostPlatform.system}");

  runtimeLibs = [
    stdenv.cc.cc.lib
    stdenv.cc.libc
    zlib
    openssl
  ];
in

stdenv.mkDerivation {
  pname = "workerd-patched";
  inherit version;

  src = fetchurl {
    url = "https://github.com/cloudflare/workerd/releases/download/v${version}/${srcInfo.asset}";
    hash = srcInfo.hash;
  };

  dontUnpack = true;

  nativeBuildInputs = [
    gzip
    patchelf
  ];

  installPhase = ''
    runHook preInstall

    mkdir -p $out/bin
    gzip -dc "$src" > $out/bin/workerd
    chmod +x $out/bin/workerd

    runHook postInstall
  '';

  postFixup = ''
    patchelf \
      --set-interpreter ${stdenv.cc.bintools.dynamicLinker} \
      --set-rpath ${lib.makeLibraryPath runtimeLibs} \
      $out/bin/workerd

    patchelf --print-interpreter $out/bin/workerd
    patchelf --print-rpath $out/bin/workerd
  '';
}
