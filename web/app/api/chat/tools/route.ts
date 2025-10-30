import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  InferUITools,
  stepCountIs,
  streamText,
  tool,
  ToolSet,
  type ModelMessage,
  type UIMessage,
} from "ai";
import z from "zod";

// NOTE: We define a type for the UI messages that includes the tools, using the InferUITools utility type.
export type MyUIMessage = UIMessage<never, never, InferUITools<typeof tools>>;

const tools = {
  getBalance: tool({
    description: 'Get the balance of a bank account',
    inputSchema: z.object({
      accountId: z.string().describe('The id of the bank account'),
    }),
    execute: async ({ accountId }) => {
      if (accountId === 'Revolut') {
        return 1000;
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

export const POST = async (req: Request): Promise<Response> => {
  const {
    messages,
  }: {
    messages: UIMessage[];
  } = await req.json();

  // NOTE: We convert the messages to the format expected by the model.
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  // NOTE: We stream the text from the model.
  const streamTextResult = streamText({
    model: openai("gpt-4o"),
    messages: modelMessages,
    tools,
    stopWhen: [stepCountIs(20)],
  });

  // NOTE: We convert the stream to the format expected by the client.
  const stream = streamTextResult.toUIMessageStream();

  // NOTE: We create the response for the client.
  return createUIMessageStreamResponse({
    stream,
  });
};
