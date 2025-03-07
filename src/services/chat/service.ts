import { events } from "fetch-event-stream"

import { BASE_URL } from "~/lib/constants"

export async function chatCompletion(
  payload: ChatCompletionPayload,
  options: ChatCompletionOptions,
) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      accept: "text/event-stream",
      "x-vqd-4": options["x-vqd-4"],
    },
    body: JSON.stringify(payload),
  })

  return {
    headers: response.headers,
    response: events(response),
  }
}

export interface ChatCompletionPayload {
  model: "claude-3-haiku-20240307"
  messages: Array<{
    role: "user" | "assistant"
    content: string
  }>
}

export interface ChatCompletionOptions {
  "x-vqd-4": string
}

export interface ChatCompletionChunk {
  role: "assistant"
  message: string
  /**
   * Unix timestamp
   */
  created: number
  action: "success"
}
