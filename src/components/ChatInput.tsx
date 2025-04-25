
import { Send, Plane } from "lucide-react";
import React, { useState, KeyboardEvent, useRef, useEffect } from "react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
};

export function ChatInput({ onSendMessage, isDisabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "56px";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className={`border bg-card rounded-2xl shadow-sm overflow-hidden flex items-end relative transition-all ${isFocused ? 'ring-2 ring-primary/50 shadow-md' : ''}`}
    >
      <div className="absolute left-4 top-3 text-muted-foreground">
        <Plane size={18} className={`transition-opacity ${isFocused ? 'opacity-100' : 'opacity-70'}`} />
      </div>
      
      <textarea
        ref={textareaRef}
        className="flex-1 py-3 px-4 pl-10 bg-transparent outline-none resize-none min-h-[56px] max-h-[200px] transition-all"
        placeholder="Ask about airport lounges..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={1}
        style={{ scrollbarWidth: "none" }}
      />
      
      <button
        className={`p-3 mr-1 text-white transition-all ${
          !message.trim() || isDisabled 
            ? "bg-primary/50 opacity-50 cursor-not-allowed" 
            : "bg-primary hover:bg-primary/90 active:scale-95"
        } rounded-xl`}
        onClick={handleSend}
        disabled={!message.trim() || isDisabled}
        aria-label="Send message"
      >
        <Send size={18} className={message.trim() && !isDisabled ? "animate-pulse-slow" : ""} />
      </button>
    </div>
  );
}
