# Core CLI Demos (AI SDK)

Node/TypeScript scripts used in the “Building AI-Powered Webapps” talk. They highlight the Vercel AI SDK server-side primitives and compare them with the raw OpenAI client.

## Setup
- Node.js 20+ recommended.
- Install deps: `npm install`
- Environment file: create `.env` in this folder with at least:
  ```
  OPENAI_API_KEY=sk-...
  ANTHROPIC_API_KEY=sk-ant-...        # needed for aisdk/4-model
  ALPHA_ADVANTAGE_API_KEY=your_key    # required for stock price tool/agent demos
  ```

## Running
- Interactive picker: `npm run run` (lists everything under `demos/` and runs with `tsx`).
- Direct run (bypass picker): `npx tsx demos/aisdk/5-tools.ts`

## Demos included
- `demos/aisdk/1-basic.ts` – single text generation with `generateText`.
- `demos/aisdk/2-stream.ts` – streaming text tokens.
- `demos/aisdk/3-object_schema.ts` – stream text, then extract structured facts with `streamObject` + Zod.
- `demos/aisdk/4-model.ts` – swap to Anthropic (`claude-3-7-sonnet-latest`).
- `demos/aisdk/5-tools.ts` – call an external stock price API via tool-calling.
- `demos/aisdk/6-agent.ts` – simple broker agent combining multiple tools with logging.
- `demos/openai/1-basic.ts` – the same idea using the raw OpenAI client.
- `demos/openai/2-stream.ts` – OpenAI streaming example.

## Notes
- Stock tool demos require `ALPHA_ADVANTAGE_API_KEY`; without it the tool calls will fail.
- The runner clears the console between runs—handy for live demos.
