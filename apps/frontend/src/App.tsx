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
        <MessageList messages={messages} />
      </div>

      {/* Input area */}
      <div className="w-full flex max-w-3xl mx-auto mb-4 border border-gray-300 rounded-xl flex-col p-4">
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <TextareaAutosize
            className="resize-none border-none focus:outline-none shadow-none mb-6"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
function MessageList({
  messages,
}: React.PropsWithoutRef<{ messages: UIMessage[] }>) {
  console.log(messages);
  return (
    <>
      {messages.map((msg, index) => (
        <div key={index} className="max-w-3xl mx-auto w-full mb-2">
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
  console.log("list",pluginInterfaces)
  const Component = pluginInterfaces[toolName];

  if (Component) {
    return <Component invocation={part.toolInvocation} />;
  }

  return <div>Tool: {toolName}</div>;
}
