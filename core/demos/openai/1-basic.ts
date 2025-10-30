import "dotenv/config";
import OpenAI from 'openai';

const client = new OpenAI();

const response = await client.responses.create({
  model: 'gpt-4o',
  input: `Write the first entry in an explorer's journal on an uncharted island`,
});

console.log(response.output_text);
