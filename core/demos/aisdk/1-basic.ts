import "dotenv/config";
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: `Write the first paragraph of an entry in an explorer's journal on an uncharted island`,
});

console.log(result.text);