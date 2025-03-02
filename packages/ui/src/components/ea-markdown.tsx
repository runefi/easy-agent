import { memo } from "react";
import MD from "markdown-to-jsx";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return <MD>{children}</MD>;
};

export const EAMarkdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
