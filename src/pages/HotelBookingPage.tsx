import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Hotel, Search, Users, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchableInput } from "@/components/SearchableInput";
import { ProtectedBooking } from "@/components/ProtectedBooking";

const HotelBookingPage = () => {
  const hotelSuggestions = [
    "The Taj Mahal Palace, Mumbai",
    "The Oberoi, New Delhi",
    "ITC Grand Chola, Chennai", 
    "The Leela Palace, Bangalore",
    "Hyatt Regency, Pune",
    "Marriott Hotel, Gurgaon",
    "Hilton Garden Inn, Mumbai",
    "Radisson Blu, Delhi"
  ];

  const citySuggestions = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", 
    "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Goa"
  ];

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
            <div className="flex items-center gap-2">
              <Hotel className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Hotel Booking</h1>
            </div>
          </div>

          <ProtectedBooking bookingType="Hotel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  Find & Book Hotels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Destination
                    </Label>
                    <SearchableInput
                      id="destination"
                      placeholder="Enter city or hotel name"
                      suggestions={[...citySuggestions, ...hotelSuggestions]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkin" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Check-in Date
                    </Label>
                    <Input
                      id="checkin"
                      type="date"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Check-out Date
                    </Label>
                    <Input
                      id="checkout"
                      type="date"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Guests & Rooms
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guests and rooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-guest-1-room">1 Guest, 1 Room</SelectItem>
                        <SelectItem value="2-guests-1-room">2 Guests, 1 Room</SelectItem>
                        <SelectItem value="3-guests-1-room">3 Guests, 1 Room</SelectItem>
                        <SelectItem value="4-guests-1-room">4 Guests, 1 Room</SelectItem>
                        <SelectItem value="2-guests-2-rooms">2 Guests, 2 Rooms</SelectItem>
                        <SelectItem value="4-guests-2-rooms">4 Guests, 2 Rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-type">Hotel Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hotel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Type</SelectItem>
                        <SelectItem value="luxury">Luxury Hotels</SelectItem>
                        <SelectItem value="business">Business Hotels</SelectItem>
                        <SelectItem value="boutique">Boutique Hotels</SelectItem>
                        <SelectItem value="budget">Budget Hotels</SelectItem>
                        <SelectItem value="resort">Resorts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price-range">Price Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Price</SelectItem>
                        <SelectItem value="budget">₹1,000 - ₹3,000</SelectItem>
                        <SelectItem value="mid">₹3,000 - ₹7,000</SelectItem>
                        <SelectItem value="premium">₹7,000 - ₹15,000</SelectItem>
                        <SelectItem value="luxury">₹15,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Search Hotels
                </Button>
              </CardContent>
            </Card>
          </ProtectedBooking>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Popular Destinations</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Mumbai Hotels
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Delhi Hotels  
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Goa Resorts
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Hotel Amenities</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Free WiFi</p>
                  <p>• Swimming Pool</p>
                  <p>• Gym & Spa</p>
                  <p>• Restaurant & Bar</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Booking Benefits</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Best Price Guarantee</p>
                  <p>• Free Cancellation</p>
                  <p>• 24/7 Customer Support</p>
                  <p>• Instant Confirmation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingPage;