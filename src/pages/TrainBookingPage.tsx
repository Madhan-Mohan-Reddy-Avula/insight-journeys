import { TrainBooking } from "@/components/TrainBooking";

const TrainBookingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Train Booking</h1>
          <TrainBooking />
        </div>
      </div>
    </div>
  );
};

export default TrainBookingPage;