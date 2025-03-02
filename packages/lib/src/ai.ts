import { CoreMessage } from "ai";

export function messagesToLines(messages: CoreMessage[]) {
  return messages.flatMap(m => {
    switch(typeof m.content){
      case "string":
        return `${m.role}: ${m.content}`
      case "object":
        if(Array.isArray(m.content)) {
          // Filter out tool calls and only include text content and tool results
          const filteredContents = m.content.filter(item => 
            item.type === 'text' || 
            (item.type === 'tool-result' && m.role === 'tool')
          );
          
          return filteredContents.map(item => {
            if (item.type === 'text') {
              return `${m.role}: ${item.text}`;
            } else if (item.type === 'tool-result') {
              return `${m.role} (${item.toolName}): ${item.result}`;
            }
            return null;
          }).filter(Boolean);
        }
        return [];
      default:
        return [];
    }
  }).filter(Boolean);
}
