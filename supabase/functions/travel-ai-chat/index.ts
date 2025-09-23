import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Travel Agent System with specialized agents
const TRAVEL_AGENTS = {
  flight: {
    name: "Flight Specialist",
    systemPrompt: `You are a flight booking specialist. Help users find the best flight options, compare airlines, understand pricing, and provide detailed flight information. You can search flights, recommend routes, and explain flight policies. Always consider factors like layovers, airlines, timing, and price when making recommendations.`
  },
  train: {
    name: "Train Expert", 
    systemPrompt: `You are a train travel expert. Help users find train routes, schedules, class options, and booking information. You understand train networks, timing, comfort levels, and pricing. Provide detailed train travel advice and route planning.`
  },
  bus: {
    name: "Bus Travel Guide",
    systemPrompt: `You are a bus travel specialist. Help users find bus routes, operators, schedules, and seating options. You understand intercity bus networks, comfort levels, timing, and budget travel. Provide practical bus travel advice.`
  },
  hotel: {
    name: "Accommodation Expert",
    systemPrompt: `You are a hotel and accommodation specialist. Help users find the best places to stay, compare amenities, understand pricing, and make booking decisions. Consider location, comfort, price, and guest reviews in your recommendations.`
  },
  planner: {
    name: "Trip Planner",
    systemPrompt: `You are a comprehensive trip planning specialist for groups of 4-5 people. You excel at creating complete travel itineraries that combine flights, trains, buses, and hotels. You understand group dynamics, budget planning, scheduling, and logistics. Help plan multi-day trips with detailed day-by-day itineraries, transportation between cities, accommodation recommendations, and budget breakdowns. Consider group preferences, travel dates, and total budget when planning.`
  }
};

const FUNCTION_TOOLS = [
  {
    type: "function",
    name: "search_flights",
    description: "Search for available flights between cities with dates and passenger count",
    parameters: {
      type: "object",
      properties: {
        from: { type: "string", description: "Departure city/airport" },
        to: { type: "string", description: "Destination city/airport" },
        date: { type: "string", description: "Departure date (YYYY-MM-DD)" },
        passengers: { type: "number", description: "Number of passengers" }
      },
      required: ["from", "to", "date", "passengers"]
    }
  },
  {
    type: "function", 
    name: "search_trains",
    description: "Search for available trains between stations with dates and passenger count",
    parameters: {
      type: "object",
      properties: {
        from: { type: "string", description: "Departure station/city" },
        to: { type: "string", description: "Destination station/city" },
        date: { type: "string", description: "Travel date (YYYY-MM-DD)" },
        passengers: { type: "number", description: "Number of passengers" }
      },
      required: ["from", "to", "date", "passengers"]
    }
  },
  {
    type: "function",
    name: "search_buses",
    description: "Search for available buses between cities with dates and passenger count",
    parameters: {
      type: "object",
      properties: {
        from: { type: "string", description: "Departure city" },
        to: { type: "string", description: "Destination city" },
        date: { type: "string", description: "Travel date (YYYY-MM-DD)" },
        passengers: { type: "number", description: "Number of passengers" }
      },
      required: ["from", "to", "date", "passengers"]
    }
  },
  {
    type: "function",
    name: "search_hotels",
    description: "Search for available hotels in a city with check-in/out dates and room requirements",
    parameters: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name" },
        checkin: { type: "string", description: "Check-in date (YYYY-MM-DD)" },
        checkout: { type: "string", description: "Check-out date (YYYY-MM-DD)" },
        guests: { type: "number", description: "Number of guests" }
      },
      required: ["city", "checkin", "checkout", "guests"]
    }
  },
  {
    type: "function",
    name: "create_trip_plan", 
    description: "Create a comprehensive trip plan for a group with multiple destinations and dates",
    parameters: {
      type: "object",
      properties: {
        trip_name: { type: "string", description: "Name for the trip" },
        destinations: { type: "array", items: { type: "string" }, description: "List of cities to visit" },
        start_date: { type: "string", description: "Trip start date (YYYY-MM-DD)" },
        end_date: { type: "string", description: "Trip end date (YYYY-MM-DD)" },
        group_size: { type: "number", description: "Number of people in group" },
        budget: { type: "number", description: "Total budget for the trip" }
      },
      required: ["trip_name", "destinations", "start_date", "end_date", "group_size"]
    }
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, agent_type, conversation_id, user_id } = await req.json();

    if (!message || !agent_type) {
      throw new Error('Message and agent_type are required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const agent = TRAVEL_AGENTS[agent_type as keyof typeof TRAVEL_AGENTS];
    if (!agent) {
      throw new Error(`Unknown agent type: ${agent_type}`);
    }

    console.log(`Processing request with ${agent.name} for user: ${user_id}`);

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: agent.systemPrompt },
      { role: "user", content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        tools: FUNCTION_TOOLS,
        tool_choice: "auto",
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    let functionResults = [];

    // Handle function calls
    if (aiMessage.tool_calls) {
      for (const toolCall of aiMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`Executing function: ${functionName}`, functionArgs);

        let functionResult;
        switch (functionName) {
          case 'search_flights':
          case 'search_trains': 
          case 'search_buses':
          case 'search_hotels':
            functionResult = {
              success: true,
              message: `Found several options for ${functionName.replace('search_', '')}. Please visit the booking page to see live results and make your selection.`,
              redirect_to: `/${functionName.replace('search_', '')}-booking`
            };
            break;
          case 'create_trip_plan':
            functionResult = {
              success: true,
              message: `Created trip plan: "${functionArgs.trip_name}" for ${functionArgs.group_size} people visiting ${functionArgs.destinations.join(', ')} from ${functionArgs.start_date} to ${functionArgs.end_date}.`,
              trip_plan: functionArgs
            };
            break;
          default:
            functionResult = { success: false, message: "Function not implemented" };
        }
        
        functionResults.push({
          function: functionName,
          result: functionResult
        });
      }
    }

    const responseData = {
      message: aiMessage.content || "I'm processing your request and can help you with travel planning.",
      agent: agent.name,
      function_calls: functionResults,
      conversation_id: conversation_id
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in travel-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I apologize, but I'm having trouble processing your request. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});