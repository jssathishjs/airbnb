import { useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [_, setLocation] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (destination) params.append("location", destination);
    if (checkIn) params.append("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.append("checkOut", format(checkOut, "yyyy-MM-dd"));
    
    setLocation(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative">
      <div 
        className="w-full h-[500px] md:h-[600px] bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501117716987-67454513bd7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Perfect Vacation Rental</h1>
            <p className="text-lg text-white mb-8">Discover handcrafted accommodations with customization options for an unforgettable stay.</p>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col space-y-4">
                <div>
                  <Label htmlFor="destination" className="text-foreground mb-2 font-medium">Where</Label>
                  <Input 
                    id="destination"
                    type="text" 
                    placeholder="Destination, city, or address" 
                    className="w-full px-4 py-3 border-gray-300 focus:ring-primary"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkin" className="text-foreground mb-2 font-medium">Check In</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="checkin"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? (
                            format(checkIn, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="checkout" className="text-foreground mb-2 font-medium">Check Out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="checkout"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? (
                            format(checkOut, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          initialFocus
                          disabled={(date) => 
                            (checkIn ? date < checkIn : false) || 
                            date < new Date()
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4"
                  onClick={handleSearch}
                >
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
