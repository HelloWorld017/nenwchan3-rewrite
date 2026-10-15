{
  inputs = {
    nixpkgs = {
      url ="github:NixOS/nixpkgs/nixpkgs-unstable";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.systems.follows = "systems";
    };

    systems = {
      url = "github:nix-systems/default-linux";
    };
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs { inherit system; };
      name = "nenwdev";
      metadata = builtins.fromJSON (builtins.readFile ./package.json);
      workerd = pkgs.callPackage ./build/workerd/workerd.nix {};

      app = pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
        pname = "${name}-app";
        version = metadata.version;
        src = ./.;

        pnpmDeps = pkgs.fetchPnpmDeps {
          inherit (finalAttrs) version src;
          pname = "${name}-app-deps";
          fetcherVersion = 4;
          hash = "sha256-eAdbm5b8mXSrB25E2jDFLFUxPQtXh195gWsb0HqCQMs=";
        };

        nativeBuildInputs = [
          pkgs.nodejs
          pkgs.pnpmConfigHook
          pkgs.pnpm
        ];

        buildPhase = ''
          runHook preBuild
          pnpm build
          runHook postBuild
        '';

        installPhase = ''
          runHook preInstall

          mkdir -p "$out/share/${name}"
          cp -r dist/. "$out/share/${name}/"
          runHook postInstall
        '';
      });

      proxyConfig = pkgs.writeText "${name}-proxy-config" ''
        {
          admin off
          auto_https off
        }

        :8080 {
          root * ${app}/share/${name}/static

          handle /api/* {
            reverse_proxy 127.0.0.1:8787
          }

          handle {
            try_files {path} /index.html
            file_server
          }

          log {
            output stdout
            format console
          }
        }
      '';

      proxyEntrypoint = pkgs.writeShellScriptBin "${name}-proxy-entrypoint" ''
        exec ${pkgs.caddy}/bin/caddy run --config ${proxyConfig} --adapter caddyfile
      '';

      backendConfig = ./backend.capnp;
      backendEntrypoint = pkgs.writeShellScriptBin "${name}-backend-entrypoint" ''
        set -euo pipefail

        if [ -z "''${BACKEND_SQLITE_PATH:-}" ]; then
          echo "BACKEND_SQLITE_PATH must be set" >&2
          exit 64
        fi

        ${pkgs.coreutils}/bin/mkdir -p "$BACKEND_SQLITE_PATH"

        exec ${workerd}/bin/workerd serve "${backendConfig}" config \
          --import-path "${app}/share/${name}/" \
          --directory-path "do-storage=$BACKEND_SQLITE_PATH" \
          "$@"
      '';

      backendEntrypointDev = pkgs.writeShellScriptBin "${name}-backend-entrypoint-dev" ''
        mkdir -p ./data
        exec ${workerd}/bin/workerd serve "${backendConfig}" config \
          --import-path "./dist" \
          --directory-path "do-storage=./data" \
          "$@"
      '';

      entrypoint = pkgs.writeShellScriptBin "entrypoint" ''
        exec ${pkgs.multirun}/bin/multirun \
          "${backendEntrypoint}/bin/${name}-backend-entrypoint" \
          "${proxyEntrypoint}/bin/${name}-proxy-entrypoint"
      '';

      image = pkgs.dockerTools.buildLayeredImage {
        inherit name;
        tag = "latest";
        contents = with pkgs.dockerTools; [
          usrBinEnv
          caCertificates
          binSh
          fakeNss
        ];

        extraCommands = ''
          mkdir -p data tmp
          chmod 1777 tmp
        '';

        config = {
          Entrypoint = [ "${entrypoint}/bin/entrypoint" ];
          Env = [
            "BACKEND_SQLITE_PATH=/data"
            "SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.crt"
            "XDG_CONFIG_HOME=/config"
            "XDG_DATA_HOME=/data"
          ];
          ExposedPorts = { "8080/tcp" = {}; };
          Volumes = { "/data" = {}; };
        };
      };
    in {
      packages = {
        default = entrypoint;
        inherit image;
      };
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.nodejs
          pkgs.pnpm
          workerd
          backendEntrypointDev
        ];
      };
    });
}
