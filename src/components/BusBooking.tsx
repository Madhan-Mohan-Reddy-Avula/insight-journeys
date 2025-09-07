import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const BusBooking = () => {
  const [date, setDate] = useState<Date>();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [buses, setBuses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   fetchBuses();
  // }, []);

  const fetchBuses = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('buses')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching buses:', error);
        return;
      }
      
      if (data) {
        setBuses(data);
        console.log('Fetched buses:', data);
      }
    } catch (error) {
      console.error('Error in fetchBuses:', error);
    }
  };

  const handleSearch = async () => {
    if (!fromCity || !toCity || !date) {
      alert('Please fill in all required fields (From, To, and Date)');
      return;
    }

    setSearching(true);
    
    try {
      // More flexible search - check if any part of the city name matches
      const filteredBuses = buses.filter((bus: any) => {
        const fromMatch = bus.from_city.toLowerCase().includes(fromCity.toLowerCase()) ||
                         fromCity.toLowerCase().includes(bus.from_city.toLowerCase());
        const toMatch = bus.to_city.toLowerCase().includes(toCity.toLowerCase()) ||
                       toCity.toLowerCase().includes(bus.to_city.toLowerCase());
        return fromMatch && toMatch;
      });
      
      setSearchResults(filteredBuses);
      console.log('Bus search results:', filteredBuses);
      
      if (filteredBuses.length === 0) {
        alert('No buses found for the selected route. Try different cities or check spelling.');
      }
    } catch (error) {
      console.error('Error in bus search:', error);
      alert('Error occurred while searching. Please try again.');
    }
    
    setSearching(false);
  };

  const handleBookBus = async (bus: any) => {
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
            booking_type: 'bus',
            from_location: fromCity,
            to_location: toCity,
            departure_date: date,
            passengers: parseInt((document.getElementById('passengers-bus') as HTMLInputElement)?.value || '1'),
            total_amount: bus.price,
            status: 'pending',
            booking_details: {
              bus_id: bus.id,
              operator_name: bus.operator_name,
              bus_type: bus.bus_type,
              departure_time: bus.departure_time,
              arrival_time: bus.arrival_time,
              bus_number: bus.bus_number
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
      console.error('Error in handleBookBus:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  // Extract unique cities from database for suggestions
  const cities = Array.from(new Set([
    ...buses.map((bus: any) => bus.from_city),
    ...buses.map((bus: any) => bus.to_city)
  ])).filter(Boolean).sort();

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Bus Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <Label htmlFor="from-bus">From</Label>
              <SearchableInput
                id="from-bus"
                placeholder="Departure city"
                suggestions={cities}
                value={fromCity}
                onChange={setFromCity}
              />
            </div>
            <div className="hidden md:flex absolute left-1/2 top-8 transform -translate-x-1/2 z-10">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapCities}
                className="rounded-full h-8 w-8 bg-background border-2"
                title="Swap cities"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-bus">To</Label>
              <SearchableInput
                id="to-bus"
                placeholder="Destination city"
                suggestions={cities}
                value={toCity}
                onChange={setToCity}
              />
            </div>
            <div className="md:hidden col-span-1 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSwapCities}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Swap
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers-bus">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passengers-bus"
                  type="number"
                  min="1"
                  max="9"
                  defaultValue="1"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button type="button" className="w-full" size="lg" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search Buses"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Available Buses ({searchResults.length} found)</h3>
            {searchResults.map((bus: any) => (
              <Card key={bus.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{bus.operator_name}</h4>
                    <p className="text-sm text-muted-foreground">{bus.bus_type} - {bus.bus_number}</p>
                    <p className="text-sm">{bus.from_city} → {bus.to_city}</p>
                    <p className="text-sm">{bus.departure_time} - {bus.arrival_time} ({bus.duration_hours}h)</p>
                    <p className="text-sm">Available seats: {bus.available_seats}</p>
                    {bus.amenities && (
                      <p className="text-xs text-muted-foreground">
                        Amenities: {bus.amenities.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{bus.price}</p>
                    <Button onClick={() => handleBookBus(bus)} size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Show all available buses if no search has been performed yet */}
        {searchResults.length === 0 && buses.length > 0 && !searching && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">All Available Buses ({buses.length} total)</h3>
            <p className="text-sm text-muted-foreground">Search above to filter buses by route</p>
            {buses.slice(0, 3).map((bus: any) => (
              <Card key={bus.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{bus.operator_name}</h4>
                    <p className="text-sm text-muted-foreground">{bus.bus_type} - {bus.bus_number}</p>
                    <p className="text-sm">{bus.from_city} → {bus.to_city}</p>
                    <p className="text-sm">{bus.departure_time} - {bus.arrival_time} ({bus.duration_hours}h)</p>
                    <p className="text-sm">Available seats: {bus.available_seats}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{bus.price}</p>
                    <Button onClick={() => handleBookBus(bus)} size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {buses.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                And {buses.length - 3} more buses... Use search to find specific routes.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};