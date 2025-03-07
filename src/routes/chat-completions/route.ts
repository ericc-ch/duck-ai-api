import consola from "consola"
import { Hono, type Context } from "hono"
import { streamSSE, type SSEMessage } from "hono/streaming"

import { getModelId, type ModelName } from "~/lib/models"
import { buildPrompt } from "~/lib/prompt"
import {
  chatCompletion,
  type ChatCompletionChunk,
  type ChatCompletionPayload,
} from "~/services/chat/service"
import { getXqvd4 } from "~/services/status/service"

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

      if (message.data === "[DONE]") {
        if (prevChunk !== undefined) {
          prevChunk.choices[0].finish_reason = "stop"

          await stream.writeSSE({
            event: "chat.completion.chunk",
            data: JSON.stringify(prevChunk),
          })
        }

        await stream.writeSSE(message as SSEMessage)
        continue
      }

      const data = JSON.parse(message.data) as ChatCompletionChunk

      if (prevChunk !== undefined) {
        await stream.writeSSE({
          event: "chat.completion.chunk",
          data: JSON.stringify(prevChunk),
        })
      }

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
            // can be "stop" when the stream ends, just before [DONE]
            finish_reason: null,
            logprobs: null,
          },
        ],
      }

      prevChunk = expectedChunk

      await stream.sleep(100)
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
    if (message.data === "[DONE]") break

    const data = JSON.parse(message.data) as ChatCompletionChunk

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
      messages: [
        {
          role: "user",
          content: buildPrompt(payload.messages),
        },
      ],
    }

    const xqvd4 = await getXqvd4()
    const response = await chatCompletion(duckPayload, {
      "x-vqd-4": xqvd4,
    })

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
