import { FlightBooking } from "@/components/FlightBooking";

const FlightBookingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Flight Booking</h1>
          <FlightBooking />
        </div>
      </div>
    </div>
  );
};

export default FlightBookingPage;