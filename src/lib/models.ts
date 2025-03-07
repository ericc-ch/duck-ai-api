import type { ExpectedModels } from "~/routes/models/types"

export type ModelName =
  | "claude-3-haiku"
  | "gpt-4o-mini"
  | "llama-3.3"
  | "mistral-small"
  | "o3-mini"

export type ModelId =
  | "claude-3-haiku-20240307"
  | "gpt-4o-mini"
  | "meta-llama/Llama-3.3-70B-Instruct-Turbo"
  | "mistralai/Mistral-Small-24B-Instruct-2501"
  | "o3-mini"

const modelMap = new Map<ModelName, ModelId>([
  ["claude-3-haiku", "claude-3-haiku-20240307"],
  ["gpt-4o-mini", "gpt-4o-mini"],
  ["llama-3.3", "meta-llama/Llama-3.3-70B-Instruct-Turbo"],
  ["mistral-small", "mistralai/Mistral-Small-24B-Instruct-2501"],
  ["o3-mini", "o3-mini"],
])

export const getModelId = (model: ModelName) => {
  const modelId = modelMap.get(model)
  if (!modelId) throw new Error(`Model ${model} not found`)

  return modelId
}

const createModel = (id: ModelName, owner: string) => {
  const currentDate = Date.now()

  return {
    id,
    object: "model",
    created: currentDate,
    owned_by: owner,
  } as const
}

export const MODELS: ExpectedModels = {
  object: "list",
  data: [
    createModel("claude-3-haiku", "anthropic"),
    createModel("gpt-4o-mini", "openai"),
    createModel("llama-3.3", "meta"),
    createModel("mistral-small", "mistralai"),
    createModel("o3-mini", "openai"),
  ],
}
