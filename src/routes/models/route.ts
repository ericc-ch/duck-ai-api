import consola from "consola"
import { Hono } from "hono"
import { FetchError } from "ofetch"

import { getModels } from "~/services/copilot/get-models/service"

export const modelRoutes = new Hono()

modelRoutes.get("/", async (c) => {
  try {
    const models = await getModels()
    return c.json(models)
  } catch (error) {
    if (error instanceof FetchError) {
      consola.error(`Request failed: ${error.message}`, error.response?._data)
    }
    throw error
  }
})
