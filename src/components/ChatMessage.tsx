import { useState } from "react";
import { User, Bot, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  onFeedback?: (feedback: "up" | "down") => void;
}

export function ChatMessage({ role, content, isStreaming, onFeedback }: ChatMessageProps) {
  const isUser = role === "user";
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    onFeedback?.(type);
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-hero flex items-center justify-center shadow-soft">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-card",
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-br-md"
              : "bg-chat-bot text-chat-bot-foreground rounded-bl-md"
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm max-w-none text-chat-bot-foreground prose-headings:text-chat-bot-foreground prose-p:text-chat-bot-foreground prose-strong:text-chat-bot-foreground prose-li:text-chat-bot-foreground prose-ul:my-2 prose-ol:my-2 prose-p:my-1 prose-headings:my-2 prose-li:my-0.5">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h3 className="text-base font-bold mt-3 mb-2">{children}</h3>,
                  h2: ({ children }) => <h4 className="text-sm font-bold mt-2 mb-1">{children}</h4>,
                  h3: ({ children }) => <h5 className="text-sm font-semibold mt-2 mb-1">{children}</h5>,
                  p: ({ children }) => <p className="text-sm leading-relaxed my-1.5">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 my-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2 text-xs">{children}</pre>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse-soft rounded-sm" />
              )}
            </div>
          )}
        </div>
        
        {/* Feedback buttons for assistant messages */}
        {!isUser && !isStreaming && content && (
          <div className="flex gap-1 ml-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 rounded-full",
                feedback === "up" 
                  ? "bg-green-100 text-green-600 hover:bg-green-100" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => handleFeedback("up")}
              disabled={feedback !== null}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 rounded-full",
                feedback === "down" 
                  ? "bg-red-100 text-red-600 hover:bg-red-100" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => handleFeedback("down")}
              disabled={feedback !== null}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
