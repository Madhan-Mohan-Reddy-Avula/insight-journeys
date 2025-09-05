import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, Send, Plane, Train, Bus, Hotel } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Message = {
  type: "ai" | "user";
  message: string;
};

const TravelAIPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      message: "Hello! I'm your AI travel assistant. I can help you plan complete trips, find the best routes, compare prices for buses, trains, flights, and hotels. What would you like to know about your travel plans?"
    }
  ]);

  const handleSendMessage = () => {
    if (!query.trim()) return;
    
    const userMessage = query.toLowerCase();
    let aiResponse = "I'm analyzing your travel request and finding the best options across all transportation modes and accommodations.";
    let shouldNavigate = false;
    let navigationPath = "";
    
    // Determine navigation based on query content
    if (userMessage.includes('flight') || userMessage.includes('fly') || userMessage.includes('airport')) {
      aiResponse = "I found some great flight options for you! Let me redirect you to our flight booking page where you can see real-time availability and prices.";
      shouldNavigate = true;
      navigationPath = "/flight-booking";
    } else if (userMessage.includes('train') || userMessage.includes('railway')) {
      aiResponse = "Perfect! I can help you find the best train routes. Redirecting you to our train booking page with live schedules and pricing.";
      shouldNavigate = true;
      navigationPath = "/train-booking";
    } else if (userMessage.includes('bus')) {
      aiResponse = "Great choice! Let me show you available bus services. Taking you to our bus booking page with real-time seat availability.";
      shouldNavigate = true;
      navigationPath = "/bus-booking";
    } else if (userMessage.includes('hotel') || userMessage.includes('stay') || userMessage.includes('accommodation')) {
      aiResponse = "I'll help you find the perfect accommodation! Redirecting to our hotel booking page with live availability and reviews.";
      shouldNavigate = true;
      navigationPath = "/hotel-booking";
    }
    
    const newMessages: Message[] = [
      { type: "user", message: query },
      { type: "ai", message: aiResponse }
    ];
    
    setMessages(prev => [...prev, ...newMessages]);
    setQuery("");
    
    // Navigate after a short delay to allow user to see the response
    if (shouldNavigate) {
      setTimeout(() => {
        navigate(navigationPath);
      }, 2000);
    }
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
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/flight-booking')}
                  >
                    <Plane className="w-4 h-4 mr-2" />
                    Book Flights
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/train-booking')}
                  >
                    <Train className="w-4 h-4 mr-2" />
                    Book Trains
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/bus-booking')}
                  >
                    <Bus className="w-4 h-4 mr-2" />
                    Book Bus
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/hotel-booking')}
                  >
                    <Hotel className="w-4 h-4 mr-2" />
                    Book Hotels
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