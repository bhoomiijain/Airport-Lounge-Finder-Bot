
import React from "react";
import { cn } from "@/lib/utils";
import { PlaneIcon, MessageCircle } from "lucide-react"; 
import ReactMarkdown from "react-markdown";

type ChatMessageProps = {
  content: string;
  isUser: boolean;
  timestamp?: Date;
};

export function ChatMessage({ content, isUser, timestamp = new Date() }: ChatMessageProps) {
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-lounge-gradient flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
          <PlaneIcon className="h-5 w-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%]",
        isUser ? "user-bubble" : "bot-bubble",
        isUser ? "bg-gradient-to-r from-primary to-lounge.blue" : "bg-card"
      )}>
        {isUser ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown components={{
              p: ({ node, ...props }) => <p {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-3 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-2 mb-1" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              a: ({ node, href, ...props }) => <a href={href} className="text-primary underline" {...props} />,
            }}>{content}</ReactMarkdown>
          </div>
        )}
        <div className={cn("text-xs mt-1 text-right", 
          isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {timeString}
        </div>
      </div>
      
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex mb-4">
      <div className="w-10 h-10 rounded-full bg-lounge-gradient flex items-center justify-center mr-2 shadow-md">
        <PlaneIcon className="h-5 w-5 text-white" />
      </div>
      <div className="bot-bubble !py-2.5">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
