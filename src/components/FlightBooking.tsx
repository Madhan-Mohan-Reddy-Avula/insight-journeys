import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plane, Users, ArrowLeftRight } from "lucide-react";
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
    const { data, error } = await (supabase as any)
      .from('flights')
      .select('*')
      .eq('is_active', true);
    
    if (!error && data) {
      setFlights(data);
    }
  };

  const handleSearch = async () => {
    if (!fromCity || !toCity || !departureDate) {
      return;
    }

    setSearching(true);
    
    // Filter flights based on search criteria
    const filteredFlights = flights.filter((flight: any) => 
      flight.from_airport.toLowerCase().includes(fromCity.toLowerCase()) &&
      flight.to_airport.toLowerCase().includes(toCity.toLowerCase())
    );
    
    setSearchResults(filteredFlights);
    setSearching(false);
  };

  const handleBookFlight = (flight: any) => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    // Proceed with booking
  };

  const airports = [
    "Mumbai (BOM)", "Delhi (DEL)", "Bangalore (BLR)", "Chennai (MAA)", "Kolkata (CCU)",
    "Hyderabad (HYD)", "Pune (PNQ)", "Ahmedabad (AMD)", "Jaipur (JAI)", "Goa (GOI)",
    "Kochi (COK)", "Thiruvananthapuram (TRV)", "Coimbatore (CJB)", "Indore (IDR)",
    "Bhopal (BHO)", "Nagpur (NAG)", "Lucknow (LKO)", "Patna (PAT)", "Srinagar (SXR)",
    "Jammu (IXJ)", "Amritsar (ATQ)", "Chandigarh (IXC)", "Dehradun (DED)", "Udaipur (UDR)"
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-flight">From</Label>
              <SearchableInput
                id="from-flight"
                placeholder="Departure city or airport"
                suggestions={airports}
                value={fromCity}
                onChange={setFromCity}
              />
            </div>
            <div className="space-y-2">
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

          <Button className="w-full" size="lg" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search Flights"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Available Flights</h3>
            {searchResults.map((flight: any) => (
              <Card key={flight.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{flight.airline_name} - {flight.flight_number}</h4>
                    <p className="text-sm">{new Date(flight.departure_time).toLocaleString()} - {new Date(flight.arrival_time).toLocaleString()}</p>
                    <p className="text-sm">Duration: {flight.duration_hours} hours</p>
                    <p className="text-sm">Available seats: {flight.available_seats}</p>
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
      </CardContent>
    </Card>
  );
};