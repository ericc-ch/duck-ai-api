import consola from "consola"
import { Hono, type Context } from "hono"
import { streamSSE, type SSEMessage } from "hono/streaming"

import { getModelId, type ModelName } from "~/lib/models"
import { state } from "~/lib/state"
import {
  chatCompletion,
  type ChatCompletionChunk,
  type ChatCompletionPayload,
} from "~/services/chat/service"

import type {
  ExpectedChatCompletionPayload,
  ExpectedCompletion,
  ExpectedCompletionChunk,
} from "./types"

export const completionRoutes = new Hono()

interface HandlerOptions {
  c: Context
  payload: ChatCompletionPayload
  stream: Awaited<ReturnType<typeof chatCompletion>>["stream"]
}

const handleStreaming = (options: HandlerOptions) => {
  return streamSSE(options.c, async (stream) => {
    const completionId = globalThis.crypto.randomUUID()
    let prevChunk: ExpectedCompletionChunk | undefined

    for await (const message of options.stream) {
      if (message.data === undefined) continue

      const data = JSON.parse(message.data) as ChatCompletionChunk

      if (data === "[DONE]") {
        if (prevChunk !== undefined) {
          prevChunk.choices[0].finish_reason = "stop"

          await stream.writeSSE({
            event: "chat.completion.chunk",
            data: JSON.stringify(prevChunk),
          })
        }

        await stream.writeSSE(message as SSEMessage)
        return
      }

      if (prevChunk !== undefined)
        await stream.writeSSE({
          event: "chat.completion.chunk",
          data: JSON.stringify(prevChunk),
        })

      const expectedChunk: ExpectedCompletionChunk = {
        id: completionId,
        created: data.created,
        model: options.payload.model,
        object: "chat.completion.chunk",
        choices: [
          {
            index: 0,
            delta: {
              content: data.message,
              role: data.role,
            },
            finish_reason: null, // can be "stop" when the stream ends, just before [DONE]
            logprobs: null,
          },
        ],
      }

      prevChunk = expectedChunk
    }
  })
}

const handleNonStreaming = async (options: HandlerOptions) => {
  const expectedResponse: ExpectedCompletion = {
    id: globalThis.crypto.randomUUID(),
    object: "chat.completion",
    created: Date.now(),
    model: options.payload.model,
    choices: [
      {
        finish_reason: "stop",
        index: 0,
        logprobs: null,
        message: {
          role: "assistant",
          content: "",
        },
      },
    ],
  }

  for await (const message of options.stream) {
    if (message.data === undefined) continue

    const data = JSON.parse(message.data) as ChatCompletionChunk

    if (data === "[DONE]") break

    expectedResponse.choices[0].message.content += data.message
  }

  return options.c.json(expectedResponse)
}

completionRoutes.post("/", async (c) => {
  try {
    const payload = await c.req.json<ExpectedChatCompletionPayload>()
    const modelId = getModelId(payload.model as ModelName)

    const duckPayload: ChatCompletionPayload = {
      model: modelId,
      messages: payload.messages,
    }

    if (!state["x-vqd-4"]) throw new Error("x-vqd-4 header not found")

    const response = await chatCompletion(duckPayload, {
      "x-vqd-4": state["x-vqd-4"],
    })

    const xqvd4 = response.headers.get("x-vqd-4")
    if (!xqvd4) {
      consola.error(
        "x-vqd-4 header not found",
        response.headers,
        response.stream,
      )
      throw new Error("x-vqd-4 header not found")
    }
    // This is meant to be run locally, by a single user
    // So updating the state like this is fine
    // eslint-disable-next-line require-atomic-updates
    state["x-vqd-4"] = xqvd4

    if (payload.stream) {
      return handleStreaming({
        c,
        payload: duckPayload,
        stream: response.stream,
      })
    }

    return await handleNonStreaming({
      c,
      payload: duckPayload,
      stream: response.stream,
    })
  } catch (error) {
    consola.error("Error occurred:", error)
    return c.json(
      {
        error: {
          message: "An unknown error occurred",
          type: "unknown_error",
        },
      },
      500,
    )
  }
})
