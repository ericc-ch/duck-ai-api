import consola from "consola"
import { events } from "fetch-event-stream"

import type { ModelId } from "~/lib/models"

import { BASE_URL } from "~/lib/constants"
import { createCookie } from "~/lib/headers"
import { state } from "~/lib/state"

export async function chatCompletion(
  payload: ChatCompletionPayload,
  options: ChatCompletionOptions,
) {
  const headers = {
    ...state.headers,
    accept: "text/event-stream",
    "content-type": "application/json",
    "x-vqd-4": options["x-vqd-4"],
    cookie: createCookie({
      dcs: state.dcs,
      dcm: state.dcm,
    }),
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
