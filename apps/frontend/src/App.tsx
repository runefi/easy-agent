import React from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import clsx from "clsx";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "@ai-sdk/ui-utils";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
    api: `${API_BASE}/stream-data`,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Message display area */}
      <div className="flex-1 p-8 container flex flex-col">
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
          <Button>Send</Button>
        </form>
      </div>
    </div>
  );
}
function MessageList({
  messages,
}: React.PropsWithoutRef<{ messages: UIMessage[] }>) {
  return (
    <>
      {messages.map((msg, index) => (
        <div key={index} className="max-w-3xl mx-auto w-full mb-2">
          <div
            className={clsx("rounded-xl p-2 px-3 w-fit", {
              "bg-black text-white float-right": msg.role === "user",
              "": msg.role === "assistant",
            })}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </>
  );
}
