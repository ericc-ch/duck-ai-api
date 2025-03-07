import consola from "consola"

import { BASE_URL } from "~/lib/constants"
import { state } from "~/lib/state"

/**
 * Mainly used to fetch x-vqd-4 token.
 *
 * Send `x-vqd-accept: 1` and the server will respond with `x-vqd-4` in the headers
 */
export async function getStatus() {
  const response = await fetch(`${BASE_URL}/status`, {
    method: "GET",
    headers: {
      ...state.headers,
      "cache-control": "no-store",
      "x-vqd-accept": "1",
    },
  })

  return {
    headers: response.headers,
    response: (await response.json()) as StatusResponse,
  }
}

export async function getXqvd4() {
  const { headers, response } = await getStatus()
  const xqvd4 = headers.get("x-vqd-4")

  if (!xqvd4) {
    consola.error("x-vqd-4 header not found", headers, response)
    throw new Error("x-vqd-4 header not found")
  }

  return xqvd4
}

interface StatusResponse {
  status: string
}
