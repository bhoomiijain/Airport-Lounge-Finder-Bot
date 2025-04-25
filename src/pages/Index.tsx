
import { ChatInterface } from "@/components/ChatInterface";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Coffee, MapPin, Plane, Users, CreditCard } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/30">
      <header className="border-b bg-card/80 backdrop-blur-sm p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-lounge-gradient flex items-center justify-center text-white font-bold">
              L
            </div>
            <h1 className="font-semibold text-xl">Lounge Finder</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex space-x-2 mr-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <Plane className="mr-1 h-3 w-3" />
                Premium Lounges
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CreditCard className="mr-1 h-3 w-3" />
                Priority Pass
              </span>
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
              Your Airport Lounge Assistant
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <div className="w-full p-2 bg-gradient-to-r from-lounge.blue/10 via-lounge.teal/10 to-lounge.blue/10 border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>200+ Countries</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>Elite Status Benefits</span>
          </div>
          <div className="flex items-center">
            <Coffee className="h-3 w-3 mr-1" />
            <span>Amenity Details</span>
          </div>
          <div className="flex items-center">
            <Plane className="h-3 w-3 mr-1" />
            <span>Real-time Updates</span>
          </div>
        </div>
      </div>
      
      <main className="flex-1 flex flex-col p-0 md:p-4 overflow-hidden">
        <Card className="flex-1 overflow-hidden border-0 md:border shadow-none md:shadow-md flex flex-col">
          <ChatInterface />
        </Card>
      </main>
    </div>
  );
};

export default Index;
