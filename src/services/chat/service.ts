import consola from "consola"
import { events } from "fetch-event-stream"

import type { ModelId } from "~/lib/models"

import { BASE_URL } from "~/lib/constants"
import { createCookie, generateRandomHeaders, randomDcm } from "~/lib/headers"

export async function chatCompletion(
  payload: ChatCompletionPayload,
  options: ChatCompletionOptions,
) {
  consola.log("Sending chat completion request", payload, options)

  const headers = {
    ...generateRandomHeaders(),
    accept: "text/event-stream",
    "x-vqd-4": options["x-vqd-4"],
    "content-type": "application/json",
    cookie: createCookie({ dcs: "1", dcm: randomDcm() }),
  }

  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const json = (await response.json()) as unknown

    consola.error("Chat completion failed:", response.headers, json)
    consola.error("Failed payload:", headers, payload)
    throw new Error(JSON.stringify(json))
  }

  return {
    headers: response.headers,
    stream: events(response),
  }
}

export interface ChatCompletionPayload {
  model: ModelId
  messages: Array<{
    role: "user" | "assistant"
    content: string
  }>
}

export interface ChatCompletionOptions {
  "x-vqd-4": string
}

export type ChatCompletionChunk =
  | {
      role: "assistant"
      message: string
      /**
       * Unix timestamp
       */
      created: number
      action: "success"
    }
  | "[DONE]"
