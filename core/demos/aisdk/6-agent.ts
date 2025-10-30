import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { stepCountIs, streamText, tool, type ToolSet } from 'ai';
import z from 'zod';
import { log } from "../../utils/logger.js";

export const tools = {
  getBalance: tool({
    description: 'Get the balance of a bank account',
    inputSchema: z.object({
      accountId: z.string().describe('The id of the bank account'),
    }),
    execute: async ({ accountId }) => {
      if (accountId === 'Revolut') {
        return 5000;
      } else if (accountId === 'BPI') {
        return 100;
      } else {
        throw new Error(`Unknown account: ${accountId}`);
      }
    },
  }),
  buyStock: tool({
    description: 'Buy a stock',
    inputSchema: z.object({
      symbol: z.string().describe('The symbol of the stock'),
      quantity: z.number().describe('The quantity of the stock to buy'),
      unitPrice: z.number().describe('The unit price of the stock'),
      balance: z.number().describe('The balance of the bank account'),
      accountId: z.string().describe('The id of the bank account'),
    }),
    execute: async ({ symbol, quantity, unitPrice, balance, accountId }) => {
      if (balance < quantity * unitPrice) {
        throw new Error('Insufficient balance');
      }
      return `Bought ${quantity} shares of ${symbol} from the ${accountId} account. The total price is ${quantity * unitPrice}. The remaining balance is ${balance - quantity * unitPrice}.`;
    },
  }),
  stockPrice: tool({
    description: 'Get the price of a stock',
    inputSchema: z.object({
      symbol: z.string().describe('The symbol of the stock'),
    }),
    execute: async ({ symbol }) => {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_ADVANTAGE_API_KEY}`);
      const data = await response.json() as { "Global Quote": { "05. price": string } };
      return Number.parseFloat(data["Global Quote"]["05. price"]);
    },
  })
} satisfies ToolSet;

const result = streamText({
  model: openai('gpt-4o'),
  system: `
    You are a simulated financial broker.
    You are authorized to buy stocks from the following accounts: Revolut and BPI.

    You have access to the following tools:
    - stockPrice: Get the price of a stock
    - getBalance: Get the balance of a bank account
    - buyStock: Buy a stock

    Use these tools to answer the user's request.
    If the user's request is not related to the stock market, you should refuse to answer.
  `,
  messages: [
    {
      role: 'user',
      content: 'Buy 10 shares of Apple (AAPL) from the Revolut account',
    }
  ],
  tools,
  stopWhen: [stepCountIs(20)]
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}

const steps = await result.steps;
log(steps);