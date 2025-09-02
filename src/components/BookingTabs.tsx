import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusBooking } from "./BusBooking";
import { TrainBooking } from "./TrainBooking";
import { FlightBooking } from "./FlightBooking";
import { Bus, Train, Plane } from "lucide-react";

export const BookingTabs = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Book Your Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred mode of transport and book tickets instantly
          </p>
        </div>
        
        <Tabs defaultValue="bus" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="bus" className="flex items-center gap-2">
              <Bus className="w-4 h-4" />
              Bus
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-2">
              <Train className="w-4 h-4" />
              Train
            </TabsTrigger>
            <TabsTrigger value="flight" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Flight
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bus">
            <BusBooking />
          </TabsContent>
          
          <TabsContent value="train">
            <TrainBooking />
          </TabsContent>
          
          <TabsContent value="flight">
            <FlightBooking />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};