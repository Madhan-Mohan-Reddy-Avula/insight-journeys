import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Train, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const TrainBooking = () => {
  const [date, setDate] = useState<Date>();
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [trains, setTrains] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('trains')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching trains:', error);
        return;
      }
      
      if (data) {
        setTrains(data);
        console.log('Fetched trains:', data);
      }
    } catch (error) {
      console.error('Error in fetchTrains:', error);
    }
  };

  const handleSearch = async () => {
    if (!fromStation || !toStation || !date) {
      return;
    }

    setSearching(true);
    
    // Filter trains based on search criteria
    const filteredTrains = trains.filter((train: any) => 
      train.from_station.toLowerCase().includes(fromStation.toLowerCase()) &&
      train.to_station.toLowerCase().includes(toStation.toLowerCase())
    );
    
    setSearchResults(filteredTrains);
    setSearching(false);
  };

  const handleBookTrain = (train: any) => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    // Proceed with booking
  };

  const stations = [
    "New Delhi Railway Station", "Mumbai Central", "Howrah Junction", "Chennai Central",
    "Bangalore City Junction", "Hyderabad Deccan", "Pune Junction", "Ahmedabad Junction",
    "Jaipur Junction", "Kanpur Central", "Lucknow Charbagh", "Nagpur Junction",
    "Bhopal Junction", "Indore Junction", "Gwalior Junction", "Agra Cantt",
    "Allahabad Junction", "Varanasi Junction", "Patna Junction", "Gaya Junction",
    "Kolkata Sealdah", "Ernakulam Junction", "Thiruvananthapuram Central", "Coimbatore Junction"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Train className="w-5 h-5 text-primary" />
          Train Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-train">From Station</Label>
              <SearchableInput
                id="from-train"
                placeholder="Departure station"
                suggestions={stations}
                value={fromStation}
                onChange={setFromStation}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-train">To Station</Label>
              <SearchableInput
                id="to-train"
                placeholder="Destination station"
                suggestions={stations}
                value={toStation}
                onChange={setToStation}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Journey Date</Label>
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
              <Label htmlFor="class-train">Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleeper">Sleeper (SL)</SelectItem>
                  <SelectItem value="3ac">3AC</SelectItem>
                  <SelectItem value="2ac">2AC</SelectItem>
                  <SelectItem value="1ac">1AC</SelectItem>
                  <SelectItem value="cc">Chair Car (CC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers-train">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passengers-train"
                  type="number"
                  min="1"
                  max="6"
                  defaultValue="1"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search Trains"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Available Trains</h3>
            {searchResults.map((train: any) => (
              <Card key={train.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{train.train_name} ({train.train_number})</h4>
                    <p className="text-sm">{train.departure_time} - {train.arrival_time}</p>
                    <p className="text-sm">Duration: {train.duration_hours} hours</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      {train.classes && Object.entries(train.classes).map(([classType, classInfo]: [string, any]) => (
                        <div key={classType} className="text-sm">
                          <span className="font-medium">{classType.toUpperCase()}: </span>
                          <span className="font-bold">₹{classInfo.price}</span>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => handleBookTrain(train)} size="sm" className="mt-2">
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