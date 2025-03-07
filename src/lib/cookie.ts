export const createCookie = (record: Record<string, string>) => {
  return Object.entries(record)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ")
}

// Random 1-10 integer, I don't know what the correct values are
export const randomDcs = () => Math.round(Math.random() * 10).toString()
export const randomDcm = () => Math.round(Math.random() * 10).toString()
