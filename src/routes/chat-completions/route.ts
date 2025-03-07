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
  response: Awaited<ReturnType<typeof chatCompletion>>["response"]
}

const handleStreaming = async (options: HandlerOptions) => {
  consola.log("Handling streaming with SSE for", options.payload)

  for await (const message of options.response) {
    consola.log(message)
  }

  return streamSSE(options.c, async (stream) => {
    const completionId = globalThis.crypto.randomUUID()
    let prevChunk: ExpectedCompletionChunk | undefined

    for await (const message of options.response) {
      consola.log(message)
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
      consola.log(expectedChunk)
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

  for await (const message of options.response) {
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

    consola.log("Received response:", response)

    if (payload.stream) {
      return await handleStreaming({
        c,
        payload: duckPayload,
        response: response.response,
      })
    }

    return await handleNonStreaming({
      c,
      payload: duckPayload,
      response: response.response,
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
