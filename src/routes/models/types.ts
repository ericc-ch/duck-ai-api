interface Model {
  id: string
  object: "model"
  created: number
  owned_by: string
}

export interface ExpectedModels {
  object: "list"
  data: Array<Model>
}
