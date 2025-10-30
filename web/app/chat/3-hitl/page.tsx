"use client";

import { Response } from "@/components/ai-elements/response";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/ChatInput";
import { Message, MessageContent } from "@/components/ai-elements/message";

const ChatPage = () => {
  // NOTE: We use the useChat hook to get the messages and send messages to the server.
  const { messages, sendMessage } = useChat();

  // NOTE: We use the useState hook to manage the input.
  const [input, setInput] = useState<string>("");

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border">
      <div className="flex flex-col h-full gap-8">
        {messages.map((message) => (
          <Message from={message.role} key={message.id}>
            <MessageContent>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Response key={`${message.id}-${i}`}>
                        {part.text}
                      </Response>
                    );
                  default:
                    return null;
                }
              })}
            </MessageContent>
          </Message>
        ))}
        <ChatInput
          input={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage({
              text: input,
            });
            setInput("");
          }}
        />
      </div>
    </div>
  );
};

export default ChatPage;
