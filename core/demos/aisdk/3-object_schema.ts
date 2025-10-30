import "dotenv/config";
import { openai } from '@ai-sdk/openai';
import { streamObject, streamText } from 'ai';
import z from 'zod';

const result = streamText({
  model: openai('gpt-4o'),
  prompt: `Write the first paragraph of an entry in an explorer's journal on an uncharted island`,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
console.log('\n');

const objectResult = streamObject({
  model: openai('gpt-4o'),
  prompt: `
    Give me an array of key facts from the following text:

    ${await result.text}

    Remove all flowerly language. Speak as if you are a scientist.
  `,
  schema: z.object({
    facts: z
      .array(z.string())
      .describe('An array of key facts from the text.'),
  }),
});

for await (const chunk of objectResult.partialObjectStream) {
  console.log(chunk);
}
console.log('\n');