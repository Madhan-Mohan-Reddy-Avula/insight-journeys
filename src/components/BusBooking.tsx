import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const BusBooking = () => {
  const [date, setDate] = useState<Date>();

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
              <Input
                id="from-bus"
                placeholder="Departure city"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-bus">To</Label>
              <Input
                id="to-bus"
                placeholder="Destination city"
                className="w-full"
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

          <Button className="w-full" size="lg">
            Search Buses
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};