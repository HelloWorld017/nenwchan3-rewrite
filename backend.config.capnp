using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (
      name = "main",
      worker = (
        compatibilityDate = "2026-07-07",
        modules = [
          (name = "backend.bundle.js", esModule = embed "/backend.bundle.js")
        ],
        bindings = [
          (name = "COUNTER", durableObjectNamespace = (className = "Counter"))
        ],
        durableObjectNamespaces = [
          (className = "Counter", uniqueKey = "nenwdev-counter")
        ],
        durableObjectStorage = (localDisk = "do-storage")
      )
    ),
    (name = "do-storage", disk = (writable = true))
  ],
  sockets = [
    (
      name = "http",
      address = "127.0.0.1:8787",
      http = (),
      service = "main"
    )
  ]
);
