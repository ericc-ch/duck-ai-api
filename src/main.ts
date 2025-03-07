#!/usr/bin/env node

import { defineCommand, runMain } from "citty"
import consola from "consola"
import { serve, type ServerHandler } from "srvx"

import { state } from "./lib/state"
import { server } from "./server"
import { getStatus } from "./services/status/service"

interface RunServerOptions {
  port: number
  verbose: boolean
}

export async function runServer(options: RunServerOptions): Promise<void> {
  if (options.verbose) {
    consola.level = 5
    consola.info("Verbose logging enabled")
  }

  const { headers } = await getStatus()
  const xqvd4 = headers.get("x-vqd-4")

  if (!xqvd4) throw new Error("x-vqd-4 header not found")

  state["x-vqd-4"] = xqvd4

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
      default: "4141",
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

    return runServer({
      port,
      verbose: args.verbose,
    })
  },
})

await runMain(main)
