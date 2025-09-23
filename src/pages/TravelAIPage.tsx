import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot, Plane, Train, Bus, Hotel, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { TravelAgentChat } from "@/components/TravelAgentChat";
import { AgentType } from "@/hooks/useTravelAgents";

const TravelAIPage = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('planner');

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">AI Travel Agents</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <TravelAgentChat 
                selectedAgent={selectedAgent}
                onAgentChange={setSelectedAgent}
              />
            </div>

            {/* Sidebar with Features */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Group Travel Specialist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Perfect for planning trips for 4-5 people with:
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>Multi-destination itineraries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="w-3 h-3 text-sky-500" />
                      <span>Mixed transport modes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hotel className="w-3 h-3 text-purple-500" />
                      <span>Group accommodation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSelectedAgent('flight')}
                    >
                      <Plane className="w-4 h-4 mr-2" />
                      Flight Agent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSelectedAgent('train')}
                    >
                      <Train className="w-4 h-4 mr-2" />
                      Train Expert
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSelectedAgent('bus')}
                    >
                      <Bus className="w-4 h-4 mr-2" />
                      Bus Guide
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSelectedAgent('hotel')}
                    >
                      <Hotel className="w-4 h-4 mr-2" />
                      Hotel Specialist
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Agent Capabilities</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Real-time search & booking</p>
                    <p>• Price comparison & optimization</p>
                    <p>• Group travel coordination</p>
                    <p>• Custom itinerary creation</p>
                    <p>• Budget planning & tracking</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAIPage;