import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Plane, Train, Bus, Hotel, MapPin, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTravelAgents, AgentType, Message } from '@/hooks/useTravelAgents';
import { useNavigate } from 'react-router-dom';

const agentIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  hotel: Hotel,
  planner: MapPin
};

const agentColors = {
  flight: 'bg-sky-500',
  train: 'bg-green-500', 
  bus: 'bg-orange-500',
  hotel: 'bg-purple-500',
  planner: 'bg-blue-500'
};

interface TravelAgentChatProps {
  selectedAgent: AgentType;
  onAgentChange: (agent: AgentType) => void;
}

export const TravelAgentChat = ({ selectedAgent, onAgentChange }: TravelAgentChatProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { messages, isLoading, sendMessage, clearConversation } = useTravelAgents();

  const handleSendMessage = async () => {
    if (!query.trim() || isLoading) return;
    
    const message = query;
    setQuery('');
    await sendMessage(message, selectedAgent);
  };

  const handleFunctionCallRedirect = (message: Message) => {
    if (message.function_calls) {
      for (const call of message.function_calls) {
        if (call.result.redirect_to) {
          setTimeout(() => {
            navigate(call.result.redirect_to);
          }, 2000);
        }
      }
    }
  };

  const formatMessageContent = (message: Message) => {
    let content = message.content;

    // Handle function call results
    if (message.function_calls && message.function_calls.length > 0) {
      const functionResults = message.function_calls.map(call => {
        if (call.result.redirect_to) {
          handleFunctionCallRedirect(message);
          return `\n\n🔄 **Taking you to ${call.result.redirect_to.replace('/', '').replace('-', ' ')} page...**`;
        }
        return `\n\n✅ **${call.function}**: ${call.result.message}`;
      }).join('');
      
      content += functionResults;
    }

    return content;
  };

  return (
    <div className="space-y-4">
      {/* Agent Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Choose Your Travel Agent</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearConversation}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(agentIcons).map(([agent, Icon]) => (
              <Button
                key={agent}
                variant={selectedAgent === agent ? "default" : "outline"}
                size="sm"
                onClick={() => onAgentChange(agent as AgentType)}
                className={cn(
                  "flex items-center gap-2 h-auto py-3",
                  selectedAgent === agent && agentColors[agent as AgentType]
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{agent === 'planner' ? 'Trip Planner' : agent}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Travel Assistant
            {selectedAgent && (
              <Badge variant="secondary" className="ml-2">
                {selectedAgent === 'planner' ? 'Trip Planner' : selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Agent
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    msg.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.type === "ai" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3",
                      msg.type === "user" 
                        ? "bg-primary text-primary-foreground ml-auto" 
                        : "bg-muted"
                    )}
                  >
                    {msg.agent && msg.type === "ai" && (
                      <div className="text-xs font-medium mb-1 opacity-70">
                        {msg.agent}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm">
                      {formatMessageContent(msg)}
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {msg.type === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <div className="text-sm">
                      <span className="animate-pulse">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                placeholder={`Ask the ${selectedAgent === 'planner' ? 'Trip Planner' : selectedAgent} agent about travel options, planning, or bookings...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="resize-none min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={isLoading || !query.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};