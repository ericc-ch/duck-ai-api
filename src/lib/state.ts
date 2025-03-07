import { STATIC_HEADERS } from "./headers"

interface State {
  "x-vqd-4": string
  dcs: "1"
  dcm: string
  headers: Record<string, string>
}

export const state: State = {
  "x-vqd-4": "",
  dcs: "1",
  dcm: "3",
  headers: STATIC_HEADERS,
}
