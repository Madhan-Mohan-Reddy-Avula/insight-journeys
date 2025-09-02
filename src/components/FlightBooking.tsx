import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plane, Users, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const FlightBooking = () => {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState("one-way");

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
              <Input
                id="from-flight"
                placeholder="Departure city or airport"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-flight">To</Label>
              <Input
                id="to-flight"
                placeholder="Destination city or airport"
                className="w-full"
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

          <Button className="w-full" size="lg">
            Search Flights
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};