import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Train, Users, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

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
      // Mock data for trains
      const mockTrains = [
        {
          id: 1,
          train_name: "Rajdhani Express",
          train_number: "12301",
          from_station: "New Delhi",
          to_station: "Mumbai Central",
          departure_time: "16:55",
          arrival_time: "08:35",
          duration_hours: 15,
          classes: {
            "1ac": { name: "First AC", price: 4500, available_seats: 10 },
            "2ac": { name: "Second AC", price: 3200, available_seats: 20 },
            "3ac": { name: "Third AC", price: 2400, available_seats: 30 },
            "sleeper": { name: "Sleeper", price: 800, available_seats: 50 }
          },
          amenities: ["wifi", "charging_ports", "pantry"]
        },
        {
          id: 2,
          train_name: "Shatabdi Express",
          train_number: "12002",
          from_station: "New Delhi",
          to_station: "Agra Cantt",
          departure_time: "06:00",
          arrival_time: "08:03",
          duration_hours: 2,
          classes: {
            "cc": { name: "Chair Car", price: 600, available_seats: 40 },
            "ec": { name: "Executive Chair", price: 1200, available_seats: 20 }
          },
          amenities: ["wifi", "charging_ports", "meals"]
        }
      ];
      
      setTrains(mockTrains);
      console.log('Loaded mock trains:', mockTrains);
    } catch (error) {
      console.error('Error in fetchTrains:', error);
    }
  };

  const handleSearch = async () => {
    if (!fromStation || !toStation || !date) {
      alert('Please fill in all required fields (From Station, To Station, and Date)');
      return;
    }

    setSearching(true);
    
    try {
      // More flexible search - check if any part of the station name matches
      const filteredTrains = trains.filter((train: any) => {
        const fromMatch = train.from_station.toLowerCase().includes(fromStation.toLowerCase()) ||
                         fromStation.toLowerCase().includes(train.from_station.toLowerCase());
        const toMatch = train.to_station.toLowerCase().includes(toStation.toLowerCase()) ||
                       toStation.toLowerCase().includes(train.to_station.toLowerCase());
        return fromMatch && toMatch;
      });
      
      setSearchResults(filteredTrains);
      console.log('Train search results:', filteredTrains);
      
      if (filteredTrains.length === 0) {
        alert('No trains found for the selected route. Try different stations or check spelling.');
      }
    } catch (error) {
      console.error('Error in train search:', error);
      alert('Error occurred while searching. Please try again.');
    }
    
    setSearching(false);
  };

  const handleViewTrainDetails = (train: any) => {
    const searchData = {
      fromStation,
      toStation,
      date,
      passengers: parseInt((document.getElementById('passengers-train') as HTMLInputElement)?.value || '1')
    };
    
    navigate('/train-details', { 
      state: { 
        train, 
        searchData 
      } 
    });
  };

  // Extract unique stations from database for suggestions
  const stations = Array.from(new Set([
    ...trains.map((train: any) => train.from_station),
    ...trains.map((train: any) => train.to_station)
  ])).filter(Boolean).sort();

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="space-y-2 md:col-span-5">
              <Label htmlFor="from-train">From Station</Label>
              <SearchableInput
                id="from-train"
                placeholder="Departure station"
                suggestions={stations}
                value={fromStation}
                onChange={setFromStation}
              />
            </div>
            <div className="md:col-span-2 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapStations}
                className="rounded-full h-10 w-10 bg-background border-2 shadow-sm"
                title="Swap stations"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 md:col-span-5">
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

          <Button type="button" className="w-full" size="lg" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search Trains"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Available Trains ({searchResults.length} found)</h3>
            {searchResults.map((train: any) => (
              <Card key={train.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{train.train_name} ({train.train_number})</h4>
                    <p className="text-sm">{train.from_station} → {train.to_station}</p>
                    <p className="text-sm">{train.departure_time} - {train.arrival_time}</p>
                    <p className="text-sm">Duration: {train.duration_hours} hours</p>
                    {train.amenities && (
                      <p className="text-xs text-muted-foreground">
                        Amenities: {train.amenities.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                     <div className="space-y-1">
                       {train.classes && Object.entries(train.classes).map(([classType, seats]: [string, any]) => (
                         <div key={classType} className="text-sm">
                           <span className="font-medium">{classType.toUpperCase()}: </span>
                           <span>{seats} seats available</span>
                         </div>
                       ))}
                     </div>
                    <Button onClick={() => handleViewTrainDetails(train)} size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Show all available trains if no search has been performed yet */}
        {searchResults.length === 0 && trains.length > 0 && !searching && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">All Available Trains ({trains.length} total)</h3>
            <p className="text-sm text-muted-foreground">Search above to filter trains by route</p>
            {trains.slice(0, 3).map((train: any) => (
              <Card key={train.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{train.train_name} ({train.train_number})</h4>
                    <p className="text-sm">{train.from_station} → {train.to_station}</p>
                    <p className="text-sm">{train.departure_time} - {train.arrival_time}</p>
                    <p className="text-sm">Duration: {train.duration_hours} hours</p>
                  </div>
                  <div className="text-right">
                     <div className="space-y-1">
                       {train.classes && Object.entries(train.classes).map(([classType, seats]: [string, any]) => (
                         <div key={classType} className="text-sm">
                           <span className="font-medium">{classType.toUpperCase()}: </span>
                           <span>{seats} seats available</span>
                         </div>
                       ))}
                     </div>
                    <Button onClick={() => handleViewTrainDetails(train)} size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {trains.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                And {trains.length - 3} more trains... Use search to find specific routes.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};