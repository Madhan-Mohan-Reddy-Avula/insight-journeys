import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";

interface ProtectedBookingProps {
  children: React.ReactNode;
  bookingType: string;
}

export const ProtectedBooking = ({ children, bookingType }: ProtectedBookingProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to your account to book {bookingType.toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate("/auth", { state: { from: location } })}
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In to Book {bookingType}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account? The sign-in page also has a sign-up option.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};