import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bus, Train, Plane } from "lucide-react";
import { Link } from "react-router-dom";

export const BookingNavigation = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Book Your Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred mode of transport and book tickets instantly
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/bus-booking">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-8 text-center">
                <Bus className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Bus Booking</h3>
                <p className="text-muted-foreground mb-6">
                  Book comfortable bus rides across cities with various amenities
                </p>
                <Button className="w-full" size="lg">
                  Book Bus Tickets
                </Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/train-booking">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-8 text-center">
                <Train className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Train Booking</h3>
                <p className="text-muted-foreground mb-6">
                  Travel by train with multiple class options and convenient timings
                </p>
                <Button className="w-full" size="lg">
                  Book Train Tickets
                </Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/flight-booking">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-8 text-center">
                <Plane className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Flight Booking</h3>
                <p className="text-muted-foreground mb-6">
                  Fly to your destination with domestic and international options
                </p>
                <Button className="w-full" size="lg">
                  Book Flight Tickets
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};