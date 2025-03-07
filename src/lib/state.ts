import { generateRandomHeaders, randomDcm } from "./headers"

interface State {
  dcs: "1"
  dcm: string
  headers: Record<string, string>
}

export const state: State = {
  dcs: "1",
  dcm: randomDcm(),
  headers: generateRandomHeaders(),
}
