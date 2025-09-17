import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Users, Wifi, Coffee } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

const BusDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { bus, searchData } = location.state || {};

  if (!bus) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/bus-booking')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p>No bus details found. Please go back and select a bus.</p>
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
      await addDoc(collection(db, 'bookings'), {
        user_id: user.uid,
        booking_type: 'bus',
        from_location: searchData?.fromCity,
        to_location: searchData?.toCity,
        departure_date: searchData?.date,
        passengers: searchData?.passengers || 1,
        total_amount: bus.price,
        status: 'pending',
        booking_details: {
          bus_id: bus.id,
          operator_name: bus.operator_name,
          bus_type: bus.bus_type,
          departure_time: bus.departure_time,
          arrival_time: bus.arrival_time,
          bus_number: bus.bus_number
        },
        created_at: new Date(),
        updated_at: new Date()
      });

      toast({
        title: "Booking Successful! 🚌",
        description: `Your bus booking for ${bus.operator_name} has been confirmed!`,
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

  const amenityIcons: { [key: string]: any } = {
    wifi: Wifi,
    charging_ports: Coffee,
    ac: Coffee,
    pantry: Coffee
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/bus-booking')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {bus.operator_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Journey Details</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Route:</span>
                        <span>{bus.from_city} → {bus.to_city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bus Type:</span>
                        <span>{bus.bus_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bus Number:</span>
                        <span>{bus.bus_number}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Timing</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departure:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {bus.departure_time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Arrival:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {bus.arrival_time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{bus.duration_hours} hours</span>
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
                          {bus.available_seats}
                        </span>
                      </div>
                    </div>
                  </div>

                  {bus.amenities && bus.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg">Amenities</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {bus.amenities.map((amenity: string, index: number) => {
                          const IconComponent = amenityIcons[amenity] || Coffee;
                          return (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              <IconComponent className="w-3 h-3" />
                              {amenity.replace('_', ' ')}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">₹{bus.price}</span>
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

export default BusDetailsPage;