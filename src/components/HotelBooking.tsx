import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Hotel, Users, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const HotelBooking = () => {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [destination, setDestination] = useState("");
  const [hotels, setHotels] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   fetchHotels();
  // }, []);

  const fetchHotels = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('hotels')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching hotels:', error);
        return;
      }
      
      if (data) {
        setHotels(data);
        console.log('Fetched hotels:', data);
      }
    } catch (error) {
      console.error('Error in fetchHotels:', error);
    }
  };

  const handleSearch = async () => {
    if (!destination || !checkInDate || !checkOutDate) {
      alert('Please fill in all required fields (Destination, Check-in Date, and Check-out Date)');
      return;
    }

    setSearching(true);
    
    try {
      // More flexible search - check multiple fields
      const filteredHotels = hotels.filter((hotel: any) => {
        const destLower = destination.toLowerCase();
        return hotel.city.toLowerCase().includes(destLower) ||
               hotel.hotel_name.toLowerCase().includes(destLower) ||
               hotel.location.toLowerCase().includes(destLower) ||
               destLower.includes(hotel.city.toLowerCase()) ||
               destLower.includes(hotel.hotel_name.toLowerCase());
      });
      
      setSearchResults(filteredHotels);
      console.log('Hotel search results:', filteredHotels);
      
      if (filteredHotels.length === 0) {
        alert('No hotels found for the selected destination. Try different city names or check spelling.');
      }
    } catch (error) {
      console.error('Error in hotel search:', error);
      alert('Error occurred while searching. Please try again.');
    }
    
    setSearching(false);
  };

  const handleBookHotel = async (hotel: any) => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    
    try {
      const { data, error } = await (supabase as any)
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            booking_type: 'hotel',
            from_location: destination,
            departure_date: checkInDate,
            return_date: checkOutDate,
            passengers: parseInt((document.getElementById('guests-hotel') as HTMLInputElement)?.value || '1'),
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
      console.log('Booking created:', data);
    } catch (error) {
      console.error('Error in handleBookHotel:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  // Extract unique cities from database for suggestions
  const cities = Array.from(new Set([
    ...hotels.map((hotel: any) => hotel.city),
    ...hotels.map((hotel: any) => hotel.hotel_name)
  ])).filter(Boolean).sort();

  const handleSwapDates = () => {
    const temp = checkInDate;
    setCheckInDate(checkOutDate);
    setCheckOutDate(temp);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hotel className="w-5 h-5 text-primary" />
          Hotel Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination-hotel">Destination</Label>
            <SearchableInput
              id="destination-hotel"
              placeholder="City or hotel name"
              suggestions={cities}
              value={destination}
              onChange={setDestination}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Check-in date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="hidden md:flex absolute left-1/2 top-8 transform -translate-x-1/2 z-10">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapDates}
                className="rounded-full h-8 w-8 bg-background border-2"
                title="Swap dates"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Check-out date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="md:hidden col-span-1 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSwapDates}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Swap Dates
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests-hotel">Guests & Rooms</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select guests and rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-guest-1-room">1 Guest, 1 Room</SelectItem>
                    <SelectItem value="2-guests-1-room">2 Guests, 1 Room</SelectItem>
                    <SelectItem value="3-guests-1-room">3 Guests, 1 Room</SelectItem>
                    <SelectItem value="4-guests-1-room">4 Guests, 1 Room</SelectItem>
                    <SelectItem value="2-guests-2-rooms">2 Guests, 2 Rooms</SelectItem>
                    <SelectItem value="4-guests-2-rooms">4 Guests, 2 Rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotel-type">Hotel Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select hotel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="luxury">Luxury Hotels</SelectItem>
                  <SelectItem value="business">Business Hotels</SelectItem>
                  <SelectItem value="boutique">Boutique Hotels</SelectItem>
                  <SelectItem value="budget">Budget Hotels</SelectItem>
                  <SelectItem value="resort">Resorts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="button" className="w-full" size="lg" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search Hotels"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Available Hotels ({searchResults.length} found)</h3>
            {searchResults.map((hotel: any) => (
              <Card key={hotel.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{hotel.hotel_name}</h4>
                    <p className="text-sm text-muted-foreground">{hotel.location}, {hotel.city}</p>
                    {hotel.star_rating && (
                      <p className="text-sm">★ {hotel.star_rating} Star Hotel</p>
                    )}
                    <p className="text-sm">Available rooms: {hotel.available_rooms}</p>
                    {hotel.amenities && (
                      <p className="text-sm text-muted-foreground">
                        Amenities: {hotel.amenities.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{hotel.price_per_night}/night</p>
                    <Button onClick={() => handleBookHotel(hotel)} size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Show all available hotels if no search has been performed yet */}
        {searchResults.length === 0 && hotels.length > 0 && !searching && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">All Available Hotels ({hotels.length} total)</h3>
            <p className="text-sm text-muted-foreground">Search above to filter hotels by destination</p>
            {hotels.slice(0, 3).map((hotel: any) => (
              <Card key={hotel.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{hotel.hotel_name}</h4>
                    <p className="text-sm text-muted-foreground">{hotel.location}, {hotel.city}</p>
                    {hotel.star_rating && (
                      <p className="text-sm">★ {hotel.star_rating} Star Hotel</p>
                    )}
                    <p className="text-sm">Available rooms: {hotel.available_rooms}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{hotel.price_per_night}/night</p>
                    <Button onClick={() => handleBookHotel(hotel)} size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {hotels.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                And {hotels.length - 3} more hotels... Use search to find specific destinations.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};