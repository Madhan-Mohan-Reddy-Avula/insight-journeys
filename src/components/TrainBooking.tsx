import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Train, Users } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const TrainBooking = () => {
  const [date, setDate] = useState<Date>();

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
              <Input
                id="from-train"
                placeholder="Departure station"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-train">To Station</Label>
              <Input
                id="to-train"
                placeholder="Destination station"
                className="w-full"
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

          <Button className="w-full" size="lg">
            Search Trains
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};