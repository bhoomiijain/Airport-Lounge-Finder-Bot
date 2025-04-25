import React, { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { queryLoungeInfo, ChatMessage as ChatMessageType } from "@/services/aiService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plane, Clock, Wifi, Coffee, Utensils, Bath, LucideIcon, Copyright } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocationButton } from "./LocationButton";

type AmenityWidget = {
  icon: LucideIcon;
  label: string;
  color: string;
};

const amenityWidgets: AmenityWidget[] = [
  { icon: Wifi, label: "Free WiFi", color: "bg-blue-500" },
  { icon: Coffee, label: "Premium Drinks", color: "bg-amber-600" },
  { icon: Utensils, label: "Buffet", color: "bg-green-600" },
  { icon: Bath, label: "Shower Facilities", color: "bg-purple-600" },
  { icon: Clock, label: "24/7 Access", color: "bg-red-500" },
];

const sampleQuestions = [
  "What lounges are available at JFK Airport?",
  "Do Priority Pass members have access to lounges at Dubai Airport?",
  "What amenities are offered at the Cathay Pacific lounge in Hong Kong?",
  "Are there any airport lounges with shower facilities in London Heathrow?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      content: "👋 Hello! I'm your Airport Lounge Assistant. Ask me about airport lounges around the world, access requirements, amenities, or anything else lounge-related! Try asking about lounges at a specific airport like 'What lounges are at Heathrow Airport?' or 'Tell me about lounges at Indira Gandhi Airport'.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end"
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(scrollToBottom, 100);
    
    setIsLoading(true);

    try {
      const response = await queryLoungeInfo(content);
      
      const botMessage: ChatMessageType = {
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      const errorMessage: ChatMessageType = {
        content: "Sorry, I encountered an error while retrieving that information. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmenityClick = (label: string) => {
    setSelectedAmenity(label);
    handleSendMessage(`Tell me about ${label} in airport lounges`);
  };

  const handleSampleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden px-4 py-4">
        <div className="max-w-3xl mx-auto mb-4">
          <div className="grid grid-cols-5 gap-2">
            {amenityWidgets.map((amenity, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center p-2 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105 transform ${selectedAmenity === amenity.label ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleAmenityClick(amenity.label)}
              >
                <div className={`w-10 h-10 rounded-full ${amenity.color} flex items-center justify-center text-white mb-2`}>
                  <amenity.icon size={20} />
                </div>
                <span className="text-xs text-center">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Card className="p-4 mb-4 border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 bg-lounge-gradient animate-pulse-slow">
                <AvatarFallback className="text-white font-bold">LF</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Lounge Finder</h3>
                <p className="text-xs text-muted-foreground">AI-powered lounge recommendations</p>
              </div>
            </div>
            <LocationButton onSendMessage={handleSendMessage} />
          </div>
        </Card>
        
        <ScrollArea className="h-[calc(100%-160px)] pr-4" ref={scrollAreaRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center my-2">
              <div className="bg-lounge-gradient p-1.5 rounded-full">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs text-muted-foreground bg-accent/50 rounded-full px-3 py-1 ml-2">
                Lounge information updated daily
              </div>
            </div>
            
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>
      </div>
      
      <div className="p-4 border-t bg-background/95 backdrop-blur-sm sticky bottom-0 mt-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {sampleQuestions.map((question, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs animate-fade-in" 
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => handleSampleQuestionClick(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
          <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground py-2 flex items-center justify-center gap-1">
        <Copyright className="h-3 w-3" /> Created by Bhoomi
      </div>
    </div>
  );
}
