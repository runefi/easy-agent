import type { ToolInvocation } from "@ai-sdk/ui-utils";
import { EAMarkdown } from "@easyagent/ui/components/ea-markdown";
import { useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";

export const Thinking = ({
  invocation,
}: {
  invocation: ToolInvocation;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {invocation.state === "call" && "Processing..."}
      {invocation.state === "result" && (
        <div
          className={`w-full border border-gray-300 rounded-xl p-4 transition-all duration-300 ease-in-out ${
            isCollapsed ? "overflow-hidden" : ""
          } hover:shadow-md hover:border-gray-400`}
          onClick={toggleCollapse}
        >
          <div className="flex justify-between items-center cursor-pointer">
            <div className="font-medium">Thinking Result</div>
            <div className="transform transition-transform duration-300 ease-in-out">
              {isCollapsed ? <ChevronDownIcon /> : <ChevronLeftIcon />}
            </div>
          </div>

          <div
            className={`w-full transition-all duration-300 ease-in-out ${
              isCollapsed ? "opacity-0 h-0" : "mt-2  opacity-100"
            }`}
          >
            <EAMarkdown children={invocation.result} />
          </div>
        </div>
      )}
    </>
  );
};
