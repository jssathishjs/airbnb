import { useState } from "react";
import { useLocation } from "wouter";
import { Calendar, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const SearchBar = () => {
  const [, setLocation] = useLocation();
  const [location, setLocationInput] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (location) {
      searchParams.append("location", location);
    }
    
    if (checkIn) {
      searchParams.append("checkIn", checkIn.toISOString());
    }
    
    if (checkOut) {
      searchParams.append("checkOut", checkOut.toISOString());
    }
    
    const queryString = searchParams.toString();
    setLocation(`/properties${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <section id="search" className="bg-white shadow-md rounded-lg max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
        <div className="relative">
          <Label className="block text-sm font-medium text-gray-800 mb-1">Location</Label>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Where are you going?" 
              className="w-full pl-4 pr-10"
              value={location}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Label className="block text-sm font-medium text-gray-800 mb-1">Check-in</Label>
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal"
              >
                {checkIn ? format(checkIn, "PPP") : (
                  <span className="text-gray-500">Add dates</span>
                )}
                <Calendar className="ml-auto h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  setCheckIn(date);
                  setCheckInOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="relative">
          <Label className="block text-sm font-medium text-gray-800 mb-1">Check-out</Label>
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal"
              >
                {checkOut ? format(checkOut, "PPP") : (
                  <span className="text-gray-500">Add dates</span>
                )}
                <Calendar className="ml-auto h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={(date) => {
                  setCheckOut(date);
                  setCheckOutOpen(false);
                }}
                disabled={(date) => (checkIn ? date < checkIn : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-end">
          <Button 
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
