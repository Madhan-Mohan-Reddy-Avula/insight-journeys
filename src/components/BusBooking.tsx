import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableInput } from "./SearchableInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

export const BusBooking = () => {
  const [date, setDate] = useState<Date>();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    // Proceed with bus search
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

          <Button className="w-full" size="lg" onClick={handleSearch}>
            Search Buses
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};