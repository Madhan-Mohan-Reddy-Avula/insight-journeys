import { Home, Bus, Train, Plane, Hotel, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Bot, label: "AI", path: "/bus-ai" },
    { icon: Bus, label: "Bus", path: "/bus-booking" },
    { icon: Train, label: "Train", path: "/train-booking" },
    { icon: Plane, label: "Flight", path: "/flight-booking" },
    { icon: Hotel, label: "Hotel", path: "/hotel-booking" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-screen-xl mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};