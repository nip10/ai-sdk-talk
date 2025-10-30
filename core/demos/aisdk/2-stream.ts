import "dotenv/config";
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const result = streamText({
  model: openai('gpt-4o'),
  prompt: `Write the first paragraph of an entry in an explorer's journal on an uncharted island`,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
