import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { stepCountIs, streamText, tool } from 'ai';
import z from 'zod';

const result = streamText({
  model: openai('gpt-4o'),
  system: `
    You are a stock market analyst.

    You have access to the following tools:
    - stockPrice: Get the price of a stock

    Use these tools to answer the user's question.
  `,
  messages: [
    {
      role: 'user',
      content: 'What is the price of the stock of Apple (AAPL)?',
    }
  ],
  tools: {
    stockPrice: tool({
      description: 'Get the current price of a stock',
      inputSchema: z.object({
        symbol: z.string().describe('The ticker symbol of the stock'),
      }),
      execute: async ({ symbol }) => {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_ADVANTAGE_API_KEY}`);
        const data = await response.json() as { "Global Quote": { "05. price": string } };
        return Number.parseFloat(data["Global Quote"]["05. price"]);
      },
    })
  },
  stopWhen: [stepCountIs(10)]
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}