import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, IndianRupee, Star } from "lucide-react";

export const FeaturedDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: "Rajasthan Heritage Trail",
      location: "Jaipur, Udaipur, Jodhpur",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=300&fit=crop",
      duration: "8 days",
      startPrice: "₹45,000",
      rating: 4.8,
      themes: ["Heritage", "Cultural"],
      description: "Explore royal palaces, ancient forts, and vibrant markets in India's most majestic state."
    },
    {
      id: 2,
      name: "Kerala Backwaters & Hills",
      location: "Alleppey, Munnar, Kochi",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      duration: "6 days",
      startPrice: "₹35,000",
      rating: 4.9,
      themes: ["Nature", "Adventure"],
      description: "Experience serene backwaters, lush tea plantations, and spice gardens in God's Own Country."
    },
    {
      id: 3,
      name: "Himachal Adventure Trek",
      location: "Manali, Kasol, Spiti Valley",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      duration: "10 days",
      startPrice: "₹28,000",
      rating: 4.7,
      themes: ["Adventure", "Nature"],
      description: "Trek through pristine mountains, camp under starlit skies, and discover hidden valleys."
    },
    {
      id: 4,
      name: "Goa Beach & Nightlife",
      location: "North & South Goa",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop",
      duration: "5 days",
      startPrice: "₹25,000",
      rating: 4.6,
      themes: ["Beach", "Nightlife"],
      description: "Relax on pristine beaches, enjoy vibrant nightlife, and savor delicious seafood."
    }
  ];

  const getThemeColor = (theme: string) => {
    const colors: { [key: string]: string } = {
      Heritage: "bg-amber-100 text-amber-800",
      Cultural: "bg-blue-100 text-blue-800",
      Nature: "bg-emerald-100 text-emerald-800",
      Adventure: "bg-green-100 text-green-800",
      Beach: "bg-cyan-100 text-cyan-800",
      Nightlife: "bg-purple-100 text-purple-800"
    };
    return colors[theme] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured <span className="bg-gradient-sunset bg-clip-text text-transparent">Destinations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover India's most captivating destinations with our AI-curated travel experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden group hover:shadow-travel transition-smooth">
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800 font-medium">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {destination.rating}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-primary/90 text-white">
                    {destination.duration}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground mb-1">
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {destination.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Starting from</div>
                    <div className="text-xl font-bold text-primary flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {destination.startPrice.replace('₹', '')}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.themes.map((theme) => (
                    <Badge
                      key={theme}
                      variant="secondary"
                      className={getThemeColor(theme)}
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="default" className="flex-1">
                    Plan This Trip
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="ocean" size="lg">
            Explore More Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};