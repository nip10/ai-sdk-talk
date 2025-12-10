# Web App (Next.js + Vercel AI SDK React)

UI used in the “Building AI-Powered Webapps” talk. It mirrors the CLI demos but adds chat UI, tool renderers, and human approvals using `@ai-sdk/react`.

## Features / pages
- `/chat/1-basic` – minimal chat + streaming via `useChat` and `/api/chat`.
- `/chat/2-tools` – stock-broker assistant with tool-calling (`/api/chat/tools`) and UI for tool inputs/outputs.
- `/chat/3-hitl` – same broker flow but with human-in-the-loop approvals for `buyStock` (`/api/chat/approval`).

## Setup
1) Install deps: `npm install`
2) Create `web/.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ALPHA_ADVANTAGE_API_KEY=your_key   # needed for stock price tool calls
   ```
3) Run dev server: `npm run dev` then open http://localhost:3000

## Notes
- API routes live in `app/api/chat/*` and use the Vercel AI SDK (`streamText`, `convertToModelMessages`, tool definitions).
- Tool demos call Alpha Vantage for pricing; without `ALPHA_ADVANTAGE_API_KEY` those parts will error.
