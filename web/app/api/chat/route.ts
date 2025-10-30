import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from "ai";

export const POST = async (req: Request): Promise<Response> => {
  // NOTE: We get the messages from the request body.
  const { messages }: { messages: UIMessage[] } = await req.json();

  // NOTE: We convert the messages to the format expected by the model.
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  // NOTE: We stream the text from the model.
  const streamTextResult = streamText({
    model: openai("gpt-4o"),
    messages: modelMessages,
  });

  // NOTE: We convert the stream to the format expected by the client.
  const stream = streamTextResult.toUIMessageStream();

  // NOTE: We create the response for the client.
  return createUIMessageStreamResponse({
    stream,
  });
};
