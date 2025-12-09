import "dotenv/config";
import OpenAI from 'openai';

const client = new OpenAI();

const stream = await client.responses.create({
  model: 'gpt-4o',
  input: `Write the first paragraph of an entry in an explorer's journal on an uncharted island`,
  stream: true,
});

for await (const event of stream) {
  if (event.type === 'response.output_text.delta') {
    process.stdout.write(event.delta);
  }
}
