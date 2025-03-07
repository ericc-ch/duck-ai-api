QVD IS SOME SORT OF CHAT IDENTIFIER
EACH CHAT HISTORY HAS ITS OWN CHAIN OF QVD

STATUS -> GENERATE NEW QVD
FIRST MESSAGE (SEND QVD) -> GET BACK NEW QVD

THE NEW QVD CAN ONLY BE USED TO CONTINUE THAT MESSAGE

MESSAGES WITH DIFFERENT HISTORY WON'T WORK

# Duck AI API

## Project Overview

A wrapper around GitHub DuckDuckGo AI API to make it OpenAI compatible, making it usable for other tools.

## Using with npx

You can run the project directly using npx:

```sh
npx duck-ai-api@latest
```

With options:

```sh
npx duck-ai-api --port 8080
```

### Command Line Options

The server accepts several command line options:

| Option        | Description            | Default |
| ------------- | ---------------------- | ------- |
| --port, -p    | Port to listen on      | 4141    |
| --verbose, -v | Enable verbose logging | false   |

## Tested Tools Compatibility

| Tool                                                             | Status | Notes                                                                 |
| ---------------------------------------------------------------- | ------ | --------------------------------------------------------------------- |
| [Aider](https://github.com/Aider-AI/aider)                       | Full   | Fully compatible                                                      |
| [bolt.diy](https://github.com/stackblitz-labs/bolt.diy)          | Full   | Fully compatible; use any random API key in UI if models fail to load |
| [Page Assist](https://github.com/n4ze3m/page-assist)             | Full   | Fully compatible                                                      |
| [Kobold AI Lite](https://github.com/LostRuins/lite.koboldai.net) | Full   | Fully compatible                                                      |

**Note:** In general, any application that uses the standard OpenAI-compatible `/chat/completions` and `/models` endpoints should work with this API.
