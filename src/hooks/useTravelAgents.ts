import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export type AgentType = 'flight' | 'train' | 'bus' | 'hotel' | 'planner';

export interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  agent?: string;
  function_calls?: any[];
}

export interface TripPlan {
  id?: string;
  trip_name: string;
  destinations: string[];
  start_date: string;
  end_date: string;
  group_size: number;
  total_budget?: number;
  status: 'planning' | 'confirmed' | 'completed';
  trip_details?: any;
}

export const useTravelAgents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: "Hello! I'm your AI travel assistant with specialized expertise in different areas. I can help you with:\n\n🛩️ **Flight bookings** - Compare airlines, find best routes\n🚂 **Train travel** - Routes, schedules, and comfort options\n🚌 **Bus bookings** - Budget-friendly intercity travel\n🏨 **Hotels** - Find perfect accommodations\n📋 **Trip planning** - Complete itineraries for groups of 4-5\n\nWhat type of travel assistance do you need today?",
      timestamp: new Date().toISOString(),
      agent: 'Welcome Assistant'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = async (message: string, agentType: AgentType = 'planner') => {
    if (!user || !message.trim()) return;

    setIsLoading(true);

    // Add user message immediately
    const userMessage: Message = {
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Call the AI chat edge function
      const { data, error } = await supabase.functions.invoke('travel-ai-chat', {
        body: {
          message,
          agent_type: agentType,
          conversation_id: conversationId,
          user_id: user.uid
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        type: 'ai',
        content: data.message,
        timestamp: new Date().toISOString(),
        agent: data.agent,
        function_calls: data.function_calls
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationId(data.conversation_id);

      // Handle function call results
      if (data.function_calls && data.function_calls.length > 0) {
        for (const functionCall of data.function_calls) {
          if (functionCall.result.redirect_to) {
            toast({
              title: "Redirecting to booking page",
              description: functionCall.result.message,
            });
            // The parent component can handle navigation based on function_calls
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        agent: 'System'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTripPlan = async (tripPlan: TripPlan) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('trip_plans')
        .insert({
          user_id: user.uid,
          trip_name: tripPlan.trip_name,
          group_size: tripPlan.group_size,
          destinations: tripPlan.destinations,
          start_date: tripPlan.start_date,
          end_date: tripPlan.end_date,
          total_budget: tripPlan.total_budget,
          status: tripPlan.status,
          trip_details: tripPlan.trip_details
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Trip Plan Created",
        description: `Successfully created "${tripPlan.trip_name}" for ${tripPlan.group_size} people.`,
      });

      return data;
    } catch (error) {
      console.error('Error creating trip plan:', error);
      toast({
        title: "Error",
        description: "Failed to create trip plan. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const getTripPlans = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('trip_plans')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trip plans:', error);
      return [];
    }
  };

  const clearConversation = () => {
    setMessages([{
      type: 'ai',
      content: "Hello! I'm your AI travel assistant. How can I help you plan your next trip?",
      timestamp: new Date().toISOString(),
      agent: 'Welcome Assistant'
    }]);
    setConversationId(null);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    createTripPlan,
    getTripPlans,
    clearConversation
  };
};