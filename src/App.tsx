import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusBookingPage from "./pages/BusBookingPage";
import TrainBookingPage from "./pages/TrainBookingPage";
import FlightBookingPage from "./pages/FlightBookingPage";
import TravelAIPage from "./pages/TravelAIPage";
import HotelBookingPage from "./pages/HotelBookingPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="pb-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ai" element={<TravelAIPage />} />
              <Route path="/bus-booking" element={<BusBookingPage />} />
              <Route path="/train-booking" element={<TrainBookingPage />} />
              <Route path="/flight-booking" element={<FlightBookingPage />} />
              <Route path="/hotel-booking" element={<HotelBookingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <BottomNavigation />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
