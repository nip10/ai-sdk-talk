import "dotenv/config";
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

const result = streamText({
  // NOTE: We replaced it with 'anthropic'.
  model: anthropic('claude-3-7-sonnet-latest'),
  prompt: `Write the first paragraph of an entry in an explorer's journal on an uncharted island`,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}