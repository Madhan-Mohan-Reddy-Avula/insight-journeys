import { TripHero } from "@/components/TripHero";
import { FeaturedDestinations } from "@/components/FeaturedDestinations";
import { HowItWorks } from "@/components/HowItWorks";
import { BookingTabs } from "@/components/BookingTabs";
import { useEffect } from "react";

const Index = () => {
  // SEO optimization
  useEffect(() => {
    document.title = "AI Trip Planner - Personalized Travel Itineraries | Smart Travel Planning";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Plan your perfect trip with AI-powered personalized itineraries. Get custom travel plans for India based on your budget, interests, and preferences. Book everything in one click.');
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AI Trip Planner",
      "description": "AI-powered personalized trip planner for India travel",
      "applicationCategory": "TravelApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <main className="min-h-screen">
      <TripHero />
      <BookingTabs />
      <FeaturedDestinations />
      <HowItWorks />
    </main>
  );
};

export default Index;
