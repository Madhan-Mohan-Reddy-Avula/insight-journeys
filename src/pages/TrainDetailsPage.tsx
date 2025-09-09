import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Train, Clock, Users, Wifi, Coffee } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const TrainDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { train, searchData } = location.state || {};

  if (!train) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/train-booking')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p>No train details found. Please go back and select a train.</p>
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
            booking_type: 'train',
            from_location: searchData?.fromStation,
            to_location: searchData?.toStation,
            departure_date: searchData?.date,
            passengers: searchData?.passengers || 1,
            total_amount: train.classes?.sleeper?.price || train.classes?.['3ac']?.price || 0,
            status: 'pending',
            booking_details: {
              train_id: train.id,
              train_name: train.train_name,
              train_number: train.train_number,
              departure_time: train.departure_time,
              arrival_time: train.arrival_time,
              duration_hours: train.duration_hours,
              classes: train.classes
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
        title: "Booking Successful! 🚂",
        description: `Your train booking for ${train.train_name} has been confirmed!`,
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
    pantry: Coffee
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/train-booking')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="w-5 h-5 text-primary" />
                {train.train_name} ({train.train_number})
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
                        <span>{train.from_station} → {train.to_station}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Train Number:</span>
                        <span>{train.train_number}</span>
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
                          {train.departure_time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Arrival:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {train.arrival_time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{train.duration_hours} hours</span>
                      </div>
                    </div>
                  </div>

                  {train.amenities && train.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg">Amenities</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {train.amenities.map((amenity: string, index: number) => {
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
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Available Classes</h3>
                    <div className="space-y-3 mt-2">
                      {train.classes && Object.entries(train.classes).map(([classType, seats]: [string, any]) => (
                        <div key={classType} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{classType.toUpperCase()}</span>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {typeof seats === 'object' ? seats.seats : seats} seats available
                              </div>
                            </div>
                            {typeof seats === 'object' && seats.price && (
                              <span className="font-bold">₹{seats.price}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Starting from</span>
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

export default TrainDetailsPage;