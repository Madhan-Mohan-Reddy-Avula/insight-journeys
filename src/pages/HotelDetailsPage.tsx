import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hotel, MapPin, Star, Wifi, Coffee, Car } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const HotelDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { hotel, searchData } = location.state || {};

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/hotel-booking')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p>No hotel details found. Please go back and select a hotel.</p>
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
            booking_type: 'hotel',
            from_location: searchData?.destination,
            departure_date: searchData?.checkInDate,
            return_date: searchData?.checkOutDate,
            passengers: searchData?.guests || 1,
            total_amount: hotel.price_per_night,
            status: 'pending',
            booking_details: {
              hotel_id: hotel.id,
              hotel_name: hotel.hotel_name,
              location: hotel.location,
              star_rating: hotel.star_rating,
              price_per_night: hotel.price_per_night,
              amenities: hotel.amenities
            }
          }
        ])
        .select();

      if (error) {
        console.error('Error creating booking:', error);
        alert('Failed to create booking. Please try again.');
        return;
      }

      alert('Booking created successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error in handleBookNow:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const amenityIcons: { [key: string]: any } = {
    wifi: Wifi,
    parking: Car,
    restaurant: Coffee,
    spa: Coffee,
    gym: Coffee,
    pool: Coffee
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/hotel-booking')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5 text-primary" />
                {hotel.hotel_name}
              </CardTitle>
              {hotel.star_rating && (
                <div className="flex items-center gap-1">
                  {renderStars(hotel.star_rating)}
                  <span className="text-sm text-muted-foreground ml-2">
                    {hotel.star_rating} Star Hotel
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Location</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                        <div>
                          <div>{hotel.location}</div>
                          <div className="text-sm text-muted-foreground">{hotel.city}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {hotel.description && (
                    <div>
                      <h3 className="font-semibold text-lg">About</h3>
                      <p className="text-muted-foreground mt-2">{hotel.description}</p>
                    </div>
                  )}

                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg">Amenities</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hotel.amenities.map((amenity: string, index: number) => {
                          const IconComponent = amenityIcons[amenity.toLowerCase()] || Coffee;
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
                    <h3 className="font-semibold text-lg">Room Details</h3>
                    <div className="space-y-3 mt-2">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Standard Room</span>
                          <span className="text-lg font-bold">₹{hotel.price_per_night}</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>• Available rooms: {hotel.available_rooms}</div>
                          <div>• Price per night</div>
                          <div>• Includes breakfast</div>
                          <div>• Free cancellation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {searchData && (
                    <div>
                      <h3 className="font-semibold text-lg">Booking Summary</h3>
                      <div className="space-y-2 mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-in:</span>
                          <span>{searchData.checkInDate ? new Date(searchData.checkInDate).toLocaleDateString() : 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-out:</span>
                          <span>{searchData.checkOutDate ? new Date(searchData.checkOutDate).toLocaleDateString() : 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guests:</span>
                          <span>{searchData.guests || 1}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold">₹{hotel.price_per_night}</span>
                        <div className="text-sm text-muted-foreground">per night</div>
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

export default HotelDetailsPage;