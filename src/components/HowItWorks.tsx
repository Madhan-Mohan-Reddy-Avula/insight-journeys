import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Brain, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  Sparkles 
} from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: MessageSquare,
      title: "Tell Us Your Preferences",
      description: "Share your destination, budget, interests, and travel style. Our AI understands what makes your perfect trip.",
      color: "bg-gradient-sunset"
    },
    {
      id: 2,
      icon: Brain,
      title: "AI Creates Your Itinerary",
      description: "Advanced algorithms analyze real-time data, local insights, and your preferences to craft a personalized itinerary.",
      color: "bg-gradient-ocean"
    },
    {
      id: 3,
      icon: MapPin,
      title: "Review & Customize",
      description: "Explore your AI-generated itinerary, make adjustments, and add or remove activities based on your preferences.",
      color: "bg-gradient-adventure"
    },
    {
      id: 4,
      icon: CreditCard,
      title: "Book Everything Instantly",
      description: "One-click booking for flights, hotels, activities, and transport. Pay securely and get instant confirmations.",
      color: "bg-primary"
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It <span className="bg-gradient-sunset bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From idea to booking in minutes. Our AI-powered platform makes travel planning effortless and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className="p-6 h-full text-center hover:shadow-travel transition-smooth group">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-sm font-bold text-primary mb-2">
                  STEP {step.id}
                </div>
                
                <h3 className="text-lg font-bold text-card-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
              
              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-hero text-center">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Plan Your Perfect Trip?
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Join thousands of travelers who trust our AI to create unforgettable experiences. 
              Start planning your dream vacation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg px-8">
                Start Planning Now
              </Button>
              <Button variant="glass" size="lg" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};