import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users } from "lucide-react";
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

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    const { data, error } = await (supabase as any)
      .from('buses')
      .select('*')
      .eq('is_active', true);
    
    if (!error && data) {
      setBuses(data);
    }
  };

  const handleSearch = async () => {
    if (!fromCity || !toCity || !date) {
      return;
    }

    setSearching(true);
    
    // Filter buses based on search criteria
    const filteredBuses = buses.filter((bus: any) => 
      bus.from_city.toLowerCase().includes(fromCity.toLowerCase()) &&
      bus.to_city.toLowerCase().includes(toCity.toLowerCase())
    );
    
    setSearchResults(filteredBuses);
    setSearching(false);
  };

  const handleBookBus = (bus: any) => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    // Proceed with booking
  };

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
    "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
    "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar",
    "Varanasi", "Srinagar", "Dhanbad", "Jodhpur", "Amritsar", "Raipur", "Allahabad"
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Button className="w-full" size="lg" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search Buses"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Available Buses</h3>
            {searchResults.map((bus: any) => (
              <Card key={bus.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{bus.operator_name}</h4>
                    <p className="text-sm text-muted-foreground">{bus.bus_type}</p>
                    <p className="text-sm">{bus.departure_time} - {bus.arrival_time}</p>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};