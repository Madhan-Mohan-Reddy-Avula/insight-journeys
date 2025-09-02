import { BusBooking } from "@/components/BusBooking";

const BusBookingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Bus Booking</h1>
          <BusBooking />
        </div>
      </div>
    </div>
  );
};

export default BusBookingPage;