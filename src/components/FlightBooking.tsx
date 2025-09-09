import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plane, Users, ArrowLeftRight, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const FlightBooking = () => {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState("one-way");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [flights, setFlights] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('flights')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching flights:', error);
        return;
      }
      
      if (data) {
        setFlights(data);
        console.log('Fetched flights:', data);
      }
    } catch (error) {
      console.error('Error in fetchFlights:', error);
    }
  };

  const handleSearch = async () => {
    if (!fromCity || !toCity || !departureDate) {
      alert('Please fill in all required fields (From, To, and Departure Date)');
      return;
    }

    setSearching(true);
    
    try {
      // More flexible search - check if any part of the airport name matches
      const filteredFlights = flights.filter((flight: any) => {
        const fromMatch = flight.from_airport.toLowerCase().includes(fromCity.toLowerCase()) ||
                         fromCity.toLowerCase().includes(flight.from_airport.toLowerCase());
        const toMatch = flight.to_airport.toLowerCase().includes(toCity.toLowerCase()) ||
                       toCity.toLowerCase().includes(flight.to_airport.toLowerCase());
        return fromMatch && toMatch;
      });
      
      setSearchResults(filteredFlights);
      console.log('Flight search results:', filteredFlights);
      
      if (filteredFlights.length === 0) {
        alert('No flights found for the selected route. Try different airports or check spelling.');
      }
    } catch (error) {
      console.error('Error in flight search:', error);
      alert('Error occurred while searching. Please try again.');
    }
    
    setSearching(false);
  };

  const handleBookFlight = async (flight: any) => {
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
            booking_type: 'flight',
            from_location: fromCity,
            to_location: toCity,
            departure_date: departureDate,
            return_date: returnDate,
            passengers: parseInt((document.getElementById('passengers-flight') as HTMLInputElement)?.value || '1'),
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
        alert('Failed to create booking. Please try again.');
        return;
      }

      alert('Booking created successfully!');
      console.log('Booking created:', data);
    } catch (error) {
      console.error('Error in handleBookFlight:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  // Extract unique airports from database for suggestions
  const airports = Array.from(new Set([
    ...flights.map((flight: any) => flight.from_airport),
    ...flights.map((flight: any) => flight.to_airport)
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
          <Plane className="w-5 h-5 text-primary" />
          Flight Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label>Trip Type</Label>
            <Select value={tripType} onValueChange={setTripType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-way">One Way</SelectItem>
                <SelectItem value="round-trip">Round Trip</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="space-y-2 md:col-span-5">
              <Label htmlFor="from-flight">From</Label>
              <SearchableInput
                id="from-flight"
                placeholder="Departure city or airport"
                suggestions={airports}
                value={fromCity}
                onChange={setFromCity}
              />
            </div>
            <div className="md:col-span-2 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapCities}
                className="rounded-full h-10 w-10 bg-background border-2 shadow-sm"
                title="Swap cities"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 md:col-span-5">
              <Label htmlFor="to-flight">To</Label>
              <SearchableInput
                id="to-flight"
                placeholder="Destination city or airport"
                suggestions={airports}
                value={toCity}
                onChange={setToCity}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : "Departure"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {tripType === "round-trip" && (
              <div className="space-y-2">
                <Label>Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !returnDate && "text-muted-foreground"
                      )}
                    >
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : "Return"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="passengers-flight">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passengers-flight"
                  type="number"
                  min="1"
                  max="9"
                  defaultValue="1"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Class</Label>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium-economy">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="button" className="w-full" size="lg" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search Flights"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Available Flights ({searchResults.length} found)</h3>
            {searchResults.map((flight: any) => (
              <Card key={flight.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{flight.airline_name} - {flight.flight_number}</h4>
                    <p className="text-sm">{flight.from_airport} → {flight.to_airport}</p>
                    <p className="text-sm">{new Date(flight.departure_time).toLocaleString()} - {new Date(flight.arrival_time).toLocaleString()}</p>
                    <p className="text-sm">Duration: {flight.duration_hours} hours | Available seats: {flight.available_seats}</p>
                    {flight.aircraft_type && (
                      <p className="text-xs text-muted-foreground">Aircraft: {flight.aircraft_type}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{flight.price}</p>
                    <Button onClick={() => handleBookFlight(flight)} size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Show all available flights if no search has been performed yet */}
        {searchResults.length === 0 && flights.length > 0 && !searching && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">All Available Flights ({flights.length} total)</h3>
            <p className="text-sm text-muted-foreground">Search above to filter flights by route</p>
            {flights.slice(0, 3).map((flight: any) => (
              <Card key={flight.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{flight.airline_name} - {flight.flight_number}</h4>
                    <p className="text-sm">{flight.from_airport} → {flight.to_airport}</p>
                    <p className="text-sm">{new Date(flight.departure_time).toLocaleString()} - {new Date(flight.arrival_time).toLocaleString()}</p>
                    <p className="text-sm">Duration: {flight.duration_hours} hours | Available seats: {flight.available_seats}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{flight.price}</p>
                    <Button onClick={() => handleBookFlight(flight)} size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {flights.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                And {flights.length - 3} more flights... Use search to find specific routes.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};