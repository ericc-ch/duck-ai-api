import { Hono } from "hono"

import { MODELS } from "~/lib/models"

export const modelRoutes = new Hono()

modelRoutes.get("/", (c) => {
  return c.json(MODELS)
})
