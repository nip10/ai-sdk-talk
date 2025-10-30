"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/components/ChatInput";
import { Response } from "@/components/ai-elements/response";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { MyUIMessage } from "@/app/api/chat/tools/route";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { Confirmation, ConfirmationAccepted, ConfirmationAction, ConfirmationActions, ConfirmationRejected, ConfirmationRequest } from "@/components/ai-elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";

const ChatPage = () => {
  // NOTE: We use the useChat hook to get the messages and send messages to the server.
  const { messages, sendMessage, addToolApprovalResponse } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat/approval',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  // NOTE: We use the useState hook to manage the input.
  const [input, setInput] = useState<string>("");

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border overflow-hidden">
      <div className="flex flex-col h-full gap-8 overflow-y-auto">
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
                  case "tool-getBalance":
                    return (
                      <Tool key={`${message.id}-${i}`}>
                        <ToolHeader type="tool-getBalance" state={part.state} />
                        <ToolContent>
                          {JSON.stringify(part.input)}
                          <ToolInput input={part.input} />
                          <ToolOutput
                            output={
                              <Response>
                                {part.output?.toString() ?? 'No output'}
                              </Response>
                            }
                            errorText={part.errorText}
                          />
                        </ToolContent>
                      </Tool>
                    );
                  case "tool-buyStock":
                    if (part.approval) {
                      return (
                        <Confirmation approval={part.approval} state={part.state} key={`${message.id}-${i}`}>
                          <div>
                            <ConfirmationRequest>
                              This tool wants to
                              <br />
                              Do you approve this action?
                            </ConfirmationRequest>
                            <ConfirmationAccepted>
                              <CheckIcon className="size-4" />
                              <span>You approved this tool execution</span>
                            </ConfirmationAccepted>
                            <ConfirmationRejected>
                              <XIcon className="size-4" />
                              <span>You rejected this tool execution</span>
                            </ConfirmationRejected>
                          </div>
                          <ConfirmationActions>
                            <ConfirmationAction
                              variant="outline"
                              onClick={() =>
                                addToolApprovalResponse({
                                  id: part.approval!.id,
                                  approved: false,
                                })
                              }
                            >
                              Reject
                            </ConfirmationAction>
                            <ConfirmationAction
                              variant="default"
                              onClick={() =>
                                addToolApprovalResponse({
                                  id: part.approval!.id,
                                  approved: true,
                                })
                              }
                            >
                              Approve
                            </ConfirmationAction>
                          </ConfirmationActions>
                        </Confirmation>
                      );
                    } else {
                      return (
                        <Tool key={`${message.id}-${i}`}>
                          <ToolHeader type="tool-buyStock" state={part.state} />
                          <ToolContent>
                            <ToolInput input={part.input} />
                            <ToolOutput
                              output={
                                <Response>
                                  {part.output?.toString() ?? 'No output'}
                                </Response>
                              }
                              errorText={part.errorText}
                            />
                          </ToolContent>
                        </Tool>
                      );
                    }
                  case "tool-stockPrice":
                    return (
                      <Tool key={`${message.id}-${i}`}>
                        <ToolHeader type="tool-stockPrice" state={part.state} />
                        <ToolContent>
                          {JSON.stringify(part.input)}
                          <ToolInput input={part.input} />
                          <ToolOutput
                            output={
                              <Response>
                                {part.output?.toString() ?? 'No output'}
                              </Response>
                            }
                            errorText={part.errorText}
                          />
                        </ToolContent>
                      </Tool>
                    );
                  default:
                    return <span key={`${message.id}-${i}`}>Unknown part type: {part.type}</span>;
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
