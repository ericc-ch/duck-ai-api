import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/main.ts"],

  format: ["esm"],
  target: "esnext",
  platform: "node",

  dts: true,
  removeNodeProtocol: false,
  sourcemap: true,
  shims: true,
  clean: true,

  env: {
    NODE_ENV: "production",
  },
})
