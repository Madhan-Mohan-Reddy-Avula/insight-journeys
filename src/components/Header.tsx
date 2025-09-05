import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">TripAI</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/profile">
              <Button variant="glass" size="sm" className="gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                Profile
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="glass" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};