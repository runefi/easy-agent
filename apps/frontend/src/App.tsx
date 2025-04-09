import React from "react";
import { Button } from "@easyagent/ui/components/button";
import TextareaAutosize from "react-textarea-autosize";
import clsx from "clsx";
import { useChat } from "@ai-sdk/react";
import { ToolInvocationUIPart, UIMessage } from "@ai-sdk/ui-utils";
import { EAMarkdown } from "@easyagent/ui/components/ea-markdown";
import { pluginInterfaces } from "../../backend/config/plugin";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
    api: `${API_BASE}/stream-data`,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 min-h-screen">
      {/* Message display area */}
      <div className="flex-1 p-8 container flex flex-col mx-auto">
        {messages.length > 0 && <MessageList messages={messages} />}
      </div>

      {/* Input area */}
      <div className="w-full flex max-w-3xl mx-auto mb-4 border border-gray-300 rounded-xl flex-col p-4">
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <TextareaAutosize
            className="resize-none border-none focus:outline-none shadow-none mb-6"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              // 添加回车键+shift提交支持
              if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
//
function MessageList({
  messages,
}: React.PropsWithoutRef<{ messages: UIMessage[] }>) {
  messages.length > 0
    ? console.log(messages[0].id, messages)
    : console.log("messages is empty");
  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className="max-w-3xl mx-auto w-full mb-2">
          <div
            className={clsx("rounded-xl p-2 px-3 w-fit flex flex-col gap-2", {
              "bg-black text-white float-right": msg.role === "user",
              "": msg.role === "assistant",
            })}
          >
            {msg.parts.map((part, index) => (
              <PartMessage key={index} part={part} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function MessageList1({
  messages,
}: React.PropsWithoutRef<{ messages: UIMessage[] }>) {
  messages.length > 0
    ? console.log(messages[0].id, messages)
    : console.log("messages is empty");
  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts
            .filter((part) => part.type !== "source")
            .map((part, index) => {
              if (part.type === "text") {
                return <div key={index}>{part.text}</div>;
              }
            })}
          {message.parts
            .filter((part) => part.type === "source")
            .map((part) => (
              <span key={`source-${part.source.id}`}>
                [
                <a href={part.source.url} target="_blank">
                  {part.source.title ?? new URL(part.source.url).hostname}
                </a>
                ]
              </span>
            ))}
        </div>
      ))}
    </div>
  );
}

type Parts = UIMessage["parts"][0];

function PartMessage({ part }: { part: Parts }) {
  switch (part.type) {
    case "text":
      return <EAMarkdown>{part.text}</EAMarkdown>;
    case "tool-invocation":
      return <ToolInvocation part={part} />;
  }
}

function ToolInvocation({ part }: { part: ToolInvocationUIPart }) {
  const toolName = part.toolInvocation.toolName;
  console.log("list", pluginInterfaces);
  const Component = pluginInterfaces[toolName];

  if (Component) {
    return <Component invocation={part.toolInvocation} />;
  }

  return <div>Tool: {toolName}</div>;
}
