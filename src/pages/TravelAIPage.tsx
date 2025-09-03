import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Message = {
  type: "ai" | "user";
  message: string;
};

const TravelAIPage = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      message: "Hello! I'm your AI travel assistant. I can help you plan complete trips, find the best routes, compare prices for buses, trains, flights, and hotels. What would you like to know about your travel plans?"
    }
  ]);

  const handleSendMessage = () => {
    if (!query.trim()) return;
    
    const newMessages: Message[] = [
      { type: "user", message: query },
      { type: "ai", message: "I'm analyzing your travel request and finding the best options across all transportation modes and accommodations. This feature will be enhanced with real AI capabilities soon!" }
    ];
    
    setMessages(prev => [...prev, ...newMessages]);
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Travel AI Assistant</h1>
            </div>
          </div>

          <Card className="h-[400px] mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg max-w-[80%]",
                      msg.type === "user" 
                        ? "ml-auto bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask me about travel plans, booking options, routes, or anything travel-related..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Quick Suggestions</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setQuery("Plan a complete trip from Delhi to Goa")}
                  >
                    Complete trip planning
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setQuery("Compare all travel options Mumbai to Bangalore")}
                  >
                    Compare travel modes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setQuery("Find budget hotels in Jaipur")}
                  >
                    Budget accommodation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Popular Destinations</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Delhi - Mumbai (All modes)</p>
                  <p>• Bangalore - Chennai (Flight/Train)</p>
                  <p>• Delhi - Jaipur (Bus/Train)</p>
                  <p>• Mumbai - Goa (Flight/Bus)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">AI Features</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Multi-modal trip planning</p>
                  <p>• Price comparison across modes</p>
                  <p>• Personalized recommendations</p>
                  <p>• Real-time booking assistance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAIPage;