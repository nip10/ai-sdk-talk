# AI SDK Talk: Building AI-Powered Webapps

Repo for a tech talk about building AI-powered webapps with the Vercel AI SDK. It contains a set of CLI demos that showcase the server-side SDK and a Next.js front-end that puts those patterns in a browser experience.

## Repo layout
- `core/` – Node/TypeScript CLI demos (streaming, structured outputs, tools, agent-style flows, OpenAI vs AI SDK clients).
- `web/` – Next.js app that reuses the same concepts in a UI: basic chat, tool-calling broker, and human-in-the-loop approvals.

## Requirements
- Node.js 20+ and npm (or pnpm/bun if you prefer).
- API keys:
  - `OPENAI_API_KEY` (required for all demos)
  - `ANTHROPIC_API_KEY` (needed for the Claude demo in `core/demos/aisdk/4-model.ts`)
  - `ALPHA_ADVANTAGE_API_KEY` (optional; required for stock-price tool demos)

## Quick start
1) Install dependencies in each project:
   - `cd core && npm install`
   - `cd web && npm install`
2) Add environment variables:
   - `core/.env`
   - `web/.env.local`

   Example:
   ```
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...        # only for the Claude demo
   ALPHA_ADVANTAGE_API_KEY=your_key    # stock price tool/agent demos
   ```
3) Run the CLI demos: `cd core && npm run run`
4) Run the web app: `cd web && npm run dev` then open http://localhost:3000

## What to try
- Start with `core` to see raw SDK primitives (generation, streaming, structured outputs, tool calling, approvals/agents).
- Move to `web` to see the same ideas with React hooks and UI affordances for tools and approvals.
- Use the stock broker examples to illustrate multi-step tool use and human approvals.
