import { BASE_URL } from "~/lib/constants"
import { state } from "~/lib/state"

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

interface StatusResponse {
  status: string
}
