import { BusBooking } from "@/components/BusBooking";
import { ProtectedBooking } from "@/components/ProtectedBooking";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BusBookingPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Bus Booking</h1>
          </div>
          <ProtectedBooking bookingType="Bus">
            <BusBooking />
          </ProtectedBooking>
        </div>
      </div>
    </div>
  );
};

export default BusBookingPage;