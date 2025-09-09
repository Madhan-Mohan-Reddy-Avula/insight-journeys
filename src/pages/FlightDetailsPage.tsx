import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plane, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const FlightDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { flight, searchData } = location.state || {};

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/flight-booking')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p>No flight details found. Please go back and select a flight.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleBookNow = async () => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            booking_type: 'flight',
            from_location: searchData?.fromCity,
            to_location: searchData?.toCity,
            departure_date: searchData?.departureDate,
            return_date: searchData?.returnDate,
            passengers: searchData?.passengers || 1,
            total_amount: flight.price,
            status: 'pending',
            booking_details: {
              flight_id: flight.id,
              airline_name: flight.airline_name,
              flight_number: flight.flight_number,
              departure_time: flight.departure_time,
              arrival_time: flight.arrival_time,
              duration_hours: flight.duration_hours,
              aircraft_type: flight.aircraft_type
            }
          }
        ])
        .select();

      if (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Booking Failed",
          description: "Failed to create booking. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Booking Successful! ✈️",
        description: `Your flight booking for ${flight.flight_number} has been confirmed!`,
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error in handleBookNow:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/flight-booking')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                {flight.airline_name} - {flight.flight_number}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Flight Details</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Route:</span>
                        <span>{flight.from_airport} → {flight.to_airport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Flight Number:</span>
                        <span>{flight.flight_number}</span>
                      </div>
                      {flight.aircraft_type && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Aircraft:</span>
                          <span>{flight.aircraft_type}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Timing</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departure:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(flight.departure_time).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Arrival:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(flight.arrival_time).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{flight.duration_hours} hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Availability</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Seats:</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {flight.available_seats}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Fare Details</h3>
                    <div className="space-y-3 mt-2">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Economy Class</span>
                            <div className="text-sm text-muted-foreground">
                              Standard seating with complimentary snacks
                            </div>
                          </div>
                          <span className="font-bold text-lg">₹{flight.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold">₹{flight.price}</span>
                        <div className="text-sm text-muted-foreground">per person</div>
                      </div>
                      <Button onClick={handleBookNow} size="lg">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsPage;