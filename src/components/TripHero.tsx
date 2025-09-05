import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/travel-hero.jpg";

export const TripHero = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [duration, setDuration] = useState("7");

  const travelThemes = [
    { name: "Heritage", icon: "🏛️", color: "bg-amber-100 text-amber-800" },
    { name: "Adventure", icon: "🏔️", color: "bg-green-100 text-green-800" },
    { name: "Nightlife", icon: "🌃", color: "bg-purple-100 text-purple-800" },
    { name: "Cultural", icon: "🎭", color: "bg-blue-100 text-blue-800" },
    { name: "Nature", icon: "🌿", color: "bg-emerald-100 text-emerald-800" },
    { name: "Beach", icon: "🏖️", color: "bg-cyan-100 text-cyan-800" },
  ];

  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleCreateItinerary = () => {
    if (destination.trim()) {
      // Navigate to AI page with search parameters
      navigate('/ai');
    } else {
      // If no destination specified, go to flight booking as default
      navigate('/flight-booking');
    }
  };

  const handleBrowseDestinations = () => {
    // Navigate to hotel booking page for destination browsing
    navigate('/hotel-booking');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-70"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <Badge variant="secondary" className="text-sm font-medium">
              AI-Powered Trip Planning
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Plan Your Perfect
            <span className="bg-gradient-sunset bg-clip-text text-transparent"> Journey</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Let AI create personalized itineraries tailored to your budget, interests, and time. 
            Discover hidden gems and seamlessly book your entire trip.
          </p>
        </div>

        {/* Trip Planning Form */}
        <Card className="p-8 backdrop-blur-lg bg-white/10 border-white/20 shadow-hero">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Destination */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destination
              </label>
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-primary"
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Budget (₹)
              </label>
              <Input
                placeholder="e.g., 50,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-primary"
              />
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Travelers
              </label>
              <Input
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-primary"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Days
              </label>
              <Input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-primary"
              />
            </div>
          </div>

          {/* Travel Themes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              What interests you most?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {travelThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => toggleTheme(theme.name)}
                  className={`p-4 rounded-lg border-2 transition-smooth text-center ${
                    selectedThemes.includes(theme.name)
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/80 hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{theme.icon}</div>
                  <div className="text-sm font-medium">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-12 py-4"
              onClick={handleCreateItinerary}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create My Itinerary
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              className="text-lg px-8 py-4"
              onClick={handleBrowseDestinations}
            >
              Browse Destinations
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-white/80 text-sm">
                Smart recommendations based on your preferences and real-time data
              </p>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Local Insights</h3>
              <p className="text-white/80 text-sm">
                Discover hidden gems and authentic experiences curated by locals
              </p>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-adventure rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">One-Click Booking</h3>
              <p className="text-white/80 text-sm">
                Seamlessly book flights, hotels, and activities all in one place
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};