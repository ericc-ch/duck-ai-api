const BROWSER_OS = [
  "Windows NT 10.0",
  "Windows NT 11.0",
  "Macintosh; Intel Mac OS X 10_15_7",
  "Macintosh; Intel Mac OS X 13_0",
  "X11; Linux x86_64",
  "Android 10",
  "Android 11",
  "Android 12",
  "Android 13",
  "iPhone; CPU iPhone OS 16_0",
  "iPad; CPU OS 16_0",
]
const BROWSER_ENGINES = ["Gecko", "AppleWebKit", "KHTML"]
const BROWSER_TYPES = ["Firefox", "Chrome", "Safari", "Edg", "Opera"]

const LANGUAGES = [
  "en-US",
  "en",
  "zh-CN",
  "es-ES",
  "fr-FR",
  "de-DE",
  "ja-JP",
  "ko-KR",
  "ru-RU",
  "pt-BR",
  "ar-SA",
  "hi-IN",
  "it-IT",
  "nl-NL",
  "sv-SE",
  "pl-PL",
  "tr-TR",
  "vi-VN",
  "id-ID",
  "th-TH",
  "uk-UA",
  "cs-CZ",
  "el-GR",
  "hu-HU",
  "ro-RO",
  "da-DK",
  "fi-FI",
  "no-NO",
  "sk-SK",
  "sl-SI",
]

const SEC_FETCH_DEST_OPTIONS = [
  "empty",
  "document",
  "nested-document",
  "script",
  "style",
  "image",
  "audio",
  "video",
  "worker",
  "sharedworker",
  "font",
  "object",
  "embed",
  "report",
  "prefetch",
  "fenced-frame",
]

const SEC_FETCH_MODE_OPTIONS = [
  "cors",
  "navigate",
  "no-cors",
  "same-origin",
  "websocket",
]

const SEC_FETCH_SITE_OPTIONS = [
  "same-origin",
  "same-site",
  "cross-site",
  "none",
]

function randomChance(chance: number): boolean {
  return Math.random() < chance
}

function generateRandomUserAgentHeader(): Record<string, string> {
  const headers: Record<string, string> = {}

  const geckoVersionStart = 20100101
  const geckoVersionEnd = 20240101
  const chromeVersionStart = 80
  const chromeVersionEnd = 140
  const safariVersionStart = 534
  const safariVersionEnd = 606

  const randomOS = BROWSER_OS[Math.floor(Math.random() * BROWSER_OS.length)]
  const randomEngine =
    BROWSER_ENGINES[Math.floor(Math.random() * BROWSER_ENGINES.length)]
  const randomBrowserType =
    BROWSER_TYPES[Math.floor(Math.random() * BROWSER_TYPES.length)]

  let userAgentString = `Mozilla/5.0 (${randomOS}; `

  switch (randomEngine) {
    case "Gecko": {
      const geckoVersionTimestamp =
        geckoVersionStart
        + Math.random() * (geckoVersionEnd - geckoVersionStart)
      const geckoVersionDate = new Date(geckoVersionTimestamp)
      const geckoVersion = `${geckoVersionDate.getFullYear()}0101`
      const firefoxVersion = Math.floor(Math.random() * 50) + 80
      userAgentString += `rv:${firefoxVersion}.0) ${randomEngine}/${geckoVersion} ${randomBrowserType}/${firefoxVersion}.0`

      break
    }
    case "AppleWebKit": {
      const webkitVersion =
        Math.floor(Math.random() * (safariVersionEnd - safariVersionStart))
        + safariVersionStart
      const chromeVersion =
        Math.floor(Math.random() * (chromeVersionEnd - chromeVersionStart))
        + chromeVersionStart
      userAgentString += `AppleWebKit/${webkitVersion}.${Math.floor(Math.random() * 100)} (KHTML, like Gecko) ${randomBrowserType}/${chromeVersion}.0.0.0 Safari/${webkitVersion}.${Math.floor(Math.random() * 100)}`

      break
    }
    case "KHTML": {
      userAgentString += `KHTML, like Gecko) ${randomBrowserType}/${Math.floor(Math.random() * 50) + 10}.0`

      break
    }
    // No default
  }

  headers["User-Agent"] = userAgentString
  return headers
}

function generateRandomSecChUAHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  const uaBrands = [
    `"Not:A-Brand";v="99", "Chromium";v="${Math.floor(Math.random() * 100) + 80}"`,
    `"Chromium";v="${Math.floor(Math.random() * 100) + 80}", "Google Chrome";v="${Math.floor(Math.random() * 100) + 80}"`,
    `"Firefox";v="${Math.floor(Math.random() * 100) + 80}"`,
    `"Safari";v="${Math.floor(Math.random() * 1000) + 500}"`,
    `"Microsoft Edge";v="${Math.floor(Math.random() * 100) + 80}"`,
    `"Opera";v="${Math.floor(Math.random() * 100) + 80}"`,
  ]
  const randomUABrand = uaBrands[Math.floor(Math.random() * uaBrands.length)]
  if (randomChance(0.8)) {
    headers["Sec-Ch-UA"] = randomUABrand
  }
  if (randomChance(0.5)) {
    headers["Sec-Ch-UA-Mobile"] = randomChance(0.5) ? "?1" : "?0"
  }
  if (randomChance(0.5)) {
    const platforms = [
      '"Windows"',
      '"macOS"',
      '"Linux"',
      '"Android"',
      '"iOS"',
      '"Chrome OS"',
    ]
    headers["Sec-Ch-UA-Platform"] =
      platforms[Math.floor(Math.random() * platforms.length)]
  }
  return headers
}

function generateRandomAcceptHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  const acceptTypes = [
    "text/html",
    "application/xhtml+xml",
    "application/xml",
    "*/*",
    "text/event-stream",
    "application/json",
    "image/webp",
    "image/apng",
  ]
  const randomAcceptTypes = acceptTypes
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * acceptTypes.length) + 1)
    .join(",")
  headers["Accept"] = randomAcceptTypes

  const acceptLanguageValues = LANGUAGES.map((lang) => {
    const q = (Math.random() * (1 - 0.1) + 0.1).toFixed(1)
    return `${lang}${lang === "en-US" ? "" : `;q=${q}`}`
  })
    .sort(() => Math.random() - 0.5)
    .join(",")
  headers["Accept-Language"] = acceptLanguageValues

  const encodings = ["gzip", "deflate", "br", "zstd", "identity"]
  const randomEncodings = encodings.sort(() => Math.random() - 0.5).join(", ")
  headers["Accept-Encoding"] = randomEncodings
  return headers
}

// eslint-disable-next-line complexity
function generateRandomOptionalHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (randomChance(0.3)) {
    headers["Cache-Control"] = randomChance(0.5) ? "no-cache" : "max-age=0"
  }
  if (randomChance(0.2)) {
    headers["Pragma"] = "no-cache"
  }
  if (randomChance(0.6)) {
    headers["DNT"] = randomChance(0.5) ? "1" : "0"
  }
  if (randomChance(0.4)) {
    headers["Sec-GPC"] = "1"
  }
  if (randomChance(0.7)) {
    headers["Connection"] = "keep-alive"
  }

  if (randomChance(0.8)) {
    headers["Sec-Fetch-Dest"] =
      SEC_FETCH_DEST_OPTIONS[
        Math.floor(Math.random() * SEC_FETCH_DEST_OPTIONS.length)
      ]
  }

  if (randomChance(0.8)) {
    headers["Sec-Fetch-Mode"] =
      SEC_FETCH_MODE_OPTIONS[
        Math.floor(Math.random() * SEC_FETCH_MODE_OPTIONS.length)
      ]
  }

  if (randomChance(0.8)) {
    headers["Sec-Fetch-Site"] =
      SEC_FETCH_SITE_OPTIONS[
        Math.floor(Math.random() * SEC_FETCH_SITE_OPTIONS.length)
      ]
  }

  if (randomChance(0.3)) {
    headers["TE"] = "trailers"
  }
  return headers
}

function generateRandomPriorityHeader(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (randomChance(0.3)) {
    let priorityValue = `u=${Math.floor(Math.random() * 5)}`
    if (randomChance(0.5)) {
      priorityValue += `, i`
    }
    headers["Priority"] = priorityValue
  }
  return headers
}

function generateRandomContentTypeHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}

  if (randomChance(0.1)) {
    headers["Content-Length"] = String(Math.floor(Math.random() * 200))
  }
  if (randomChance(0.05)) {
    headers["Origin"] = "https://duckduckgo.com"
  }
  if (randomChance(0.05)) {
    headers["Referer"] = "https://duckduckgo.com/"
  }
  return headers
}

export function generateRandomHeaders(): Record<string, string> {
  let headersObj: Record<string, string> = {}

  headersObj = { ...headersObj, ...generateRandomUserAgentHeader() }
  headersObj = { ...headersObj, ...generateRandomSecChUAHeaders() }
  headersObj = { ...headersObj, ...generateRandomAcceptHeaders() }
  headersObj = { ...headersObj, ...generateRandomOptionalHeaders() }
  headersObj = { ...headersObj, ...generateRandomPriorityHeader() }
  headersObj = { ...headersObj, ...generateRandomContentTypeHeaders() }

  // --- Random Header Order (Optional) ---
  if (randomChance(0.1)) {
    const headerEntries = Object.entries(headersObj)
    const shuffledEntries = headerEntries.sort(() => Math.random() - 0.5)
    const orderedHeaders: Record<string, string> = {}
    for (const [key, value] of shuffledEntries) {
      orderedHeaders[key] = value
    }
    return orderedHeaders
  }

  return headersObj
}

export const createCookie = (record: Record<string, string>) => {
  return Object.entries(record)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ")
}

// Random 1-10 integer, I don't know what the correct values are
export const randomDcs = () => Math.round(Math.random() * 10).toString()
export const randomDcm = () => Math.round(Math.random() * 8).toString()
