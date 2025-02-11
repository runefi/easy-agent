import React from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import clsx from "clsx";
import { useChat } from "ai/react";
import { UIMessage } from "@ai-sdk/ui-utils";

const API_BASE = import.meta.env.VITE_API_BASE;

type Session = {
  id: string;
  title: string;
  isActive?: boolean;
};

type SessionSidebarProps = React.ComponentProps<typeof Sidebar> & {
  sessions: Session[];
};

function HeaderTrigger() {
  const { state } = useSidebar();

  return <>{state == "collapsed" && <SidebarTrigger className="-ml-1" />}</>;
}

export function SessionSidebar(props: SessionSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <div className="flex justify-between pt-2 pl-2">
          <SidebarTrigger className="-ml-1 text-md" />
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
            {props.sessions.map((session) => (
              <SidebarMenuItem key={session.title} className="mx-2 rounded-md">
                <SidebarMenuButton
                  asChild
                  isActive={session.isActive}
                  className="p-2"
                >
                  <span>{session.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
export default function App() {
  // Dummy conversation list
  const dummyConversations = [
    { id: "1", title: "Conversation 1" },
    { id: "2", title: "Conversation 2" },
    { id: "3", title: "Conversation 3" },
  ];

  const { messages, input, handleInputChange, handleSubmit } =
    useChat({
      maxSteps: 5,
      api:`${API_BASE}/stream-data`,
    });

  return (
    <SidebarProvider>
      <SessionSidebar sessions={dummyConversations} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <HeaderTrigger />
        </header>
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
      </SidebarInset>
    </SidebarProvider>
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
