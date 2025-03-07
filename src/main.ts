#!/usr/bin/env node

import { defineCommand, runMain } from "citty"
import consola from "consola"
import { serve, type ServerHandler } from "srvx"

import { server } from "./server"

interface RunServerOptions {
  port: number
  verbose: boolean
}

export function runServer(options: RunServerOptions) {
  if (options.verbose) {
    consola.level = 5
    consola.info("Verbose logging enabled")
  }

  const serverUrl = `http://localhost:${options.port}`
  consola.box(`Server started at ${serverUrl}`)

  serve({
    fetch: server.fetch as ServerHandler,
    port: options.port,
  })
}

const main = defineCommand({
  args: {
    port: {
      alias: "p",
      type: "string",
      default: "4460",
      description: "Port to listen on",
    },
    verbose: {
      alias: "v",
      type: "boolean",
      default: false,
      description: "Enable verbose logging",
    },
  },
  run({ args }) {
    const port = Number.parseInt(args.port, 10)

    runServer({
      port,
      verbose: args.verbose,
    })
  },
})

await runMain(main)
