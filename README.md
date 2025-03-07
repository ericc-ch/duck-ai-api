# Copilot API

## Warning

As of 3 Mar 2025, after around 1 month of usage, GitHub finally sends me the first warning email:

```plaintext
from:     support@githubsupport.com via github.com
to:       Erick Christian <erickchristian48@gmail.com>
date:     Mar 3, 2025, 2:41 PM
subject:  Regarding Your Copilot Access
```

> Hello @ericc-ch,
>
> On behalf of the GitHub Security team, I want to first extend our gratitude for your continued use of GitHub and for being a valued member of the GitHub community.
>
> Recent activity on your account caught the attention of our abuse-detection systems. This activity included use of Copilot that was indicative of scripted interactions or of an otherwise deliberately unusual or strenuous nature. While we have not yet restricted Copilot access for your account, further anomalous activity could result in a temporary suspension of your Copilot access.
>
> While I’m unable to share specifics on rate limits, we prohibit all use of our servers for any form of excessive automated bulk activity, as well as any activity that places undue burden on our servers through automated means. Please refer to our Acceptable Use Policies on this topic: https://docs.github.com/site-policy/acceptable-use-policies/github-acceptable-use-policies#4-spam-and-inauthentic-activity-on-github.
>
> Please also refer to our Terms for Additional Products and Features for GitHub Copilot for specific terms: https://docs.github.com/site-policy/github-terms/github-terms-for-additional-products-and-features#github-copilot.
>
> Sincerely,
> GitHub Security

I think the reason could be due to the following:

- The spoofing wasn't enough. Just faking a few headers maybe just wasn't enough. There were also some sort of machine and session id that I wasn't able to replicate. I mostly suspect these headers are used for telemetry.
- I use `aider` mostly using `architect` mode, which leads to increased calls to the API. This is the most likely culprit
- I also used the API with PageAssist as a replacement for ChatGPT/Claude. The topics are often not related to coding, and GitHub could be flagging these. Though I doubt they check every single prompt that's coming in.

So, for now I'll be stopping working on this project. I know this project is nothing compared to other, big, and actually legal open source projects, but I still want to thank everyone that uses this project and helped me work on it.

This is the repo that earned me my first Starstruck badge, so it has a special place in my heart.

Now back to rawdogging projects without AI. Cheers!

---

⚠️ **EDUCATIONAL PURPOSE ONLY** ⚠️
This project is a reverse-engineered implementation of the GitHub Copilot API created for educational purposes only. It is not officially supported by GitHub and should not be used in production environments.

## Project Overview

A wrapper around GitHub Copilot API to make it OpenAI compatible, making it usable for other tools.

## Demo

https://github.com/user-attachments/assets/7654b383-669d-4eb9-b23c-06d7aefee8c5

## Prerequisites

- Bun (>= 1.2.x)
- GitHub account with Copilot Individual subscription

## Installation

To install dependencies, run:

```sh
bun install
```

## Using with npx

You can run the project directly using npx:

```sh
npx copilot-api@latest
```

With options:

```sh
npx copilot-api --port 8080
```

## Running from Source

The project can be run from source in several ways:

### Development Mode

```sh
bun run dev
```

Starts the server with hot reloading enabled, which automatically restarts the server when code changes are detected. This is ideal for development.

### Production Mode

```sh
bun run start
```

Runs the server in production mode with hot reloading disabled. Use this for deployment or production environments.

### Command Line Options

The server accepts several command line options:

| Option        | Description                          | Default |
| ------------- | ------------------------------------ | ------- |
| --port, -p    | Port to listen on                    | 4141    |
| --verbose, -v | Enable verbose logging               | false   |
| --log-file    | File to log request/response details | -       |

Note: The `--help, -h` option is automatically available through the underlying command-line framework.

Example with options:

```sh
bun run start --port 8080 --verbose
```

In all cases, the server will start and listen for API requests on the specified port.

## Tested Tools Compatibility

| Tool                                                             | Status | Notes                                                                 |
| ---------------------------------------------------------------- | ------ | --------------------------------------------------------------------- |
| [Aider](https://github.com/Aider-AI/aider)                       | Full   | Fully compatible                                                      |
| [bolt.diy](https://github.com/stackblitz-labs/bolt.diy)          | Full   | Fully compatible; use any random API key in UI if models fail to load |
| [Page Assist](https://github.com/n4ze3m/page-assist)             | Full   | Fully compatible                                                      |
| [Kobold AI Lite](https://github.com/LostRuins/lite.koboldai.net) | Full   | Fully compatible                                                      |

**Note:** In general, any application that uses the standard OpenAI-compatible `/chat/completions` and `/models` endpoints should work with this API.
