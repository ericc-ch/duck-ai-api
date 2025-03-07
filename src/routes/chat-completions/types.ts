// https://platform.openai.com/docs/api-reference

export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

// Streaming types

export interface ExpectedCompletionChunk {
  choices: [Choice]
  created: number
  object: "chat.completion.chunk"
  id: string
  model: string
}

interface Delta {
  content?: string
  role?: string
}

interface Choice {
  index: number
  delta: Delta
  finish_reason: "stop" | null
  logprobs: null
}

// Non-streaming types

export interface ExpectedCompletion {
  id: string
  object: string
  created: number
  model: string
  choices: [ChoiceNonStreaming]
}

interface ChoiceNonStreaming {
  index: number
  message: Message
  logprobs: null
  finish_reason: "stop"
}

// Payload types

export interface ExpectedChatCompletionPayload {
  model: string
  messages: Array<Message>
  stream: boolean
}
