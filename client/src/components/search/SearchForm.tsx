import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Location } from "@shared/schema";

export default function SearchForm() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  const [destination, setDestination] = useState(searchParams.get("location") || "");
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")!) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")!) : undefined
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  
  const { data: locations } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (destination) params.append("location", destination);
    if (checkIn) params.append("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.append("checkOut", format(checkOut, "yyyy-MM-dd"));
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (bedrooms) params.append("bedrooms", bedrooms);
    
    const newSearch = params.toString();
    if (location !== "/properties") {
      setLocation(`/properties?${newSearch}`);
    } else if (search !== `?${newSearch}`) {
      // Only update if the search params actually changed
      setLocation(`/properties?${newSearch}`);
    }
  };
  
  const handleClear = () => {
    setDestination("");
    setCheckIn(undefined);
    setCheckOut(undefined);
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    
    setLocation("/properties");
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <Label htmlFor="destination" className="mb-2 block">Destination</Label>
          <Input
            id="destination"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            list="location-list"
          />
          <datalist id="location-list">
            {locations?.map((loc) => (
              <option key={loc.id} value={loc.name} />
            ))}
          </datalist>
        </div>
        
        <div>
          <Label htmlFor="check-in" className="mb-2 block">Check In</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="check-in"
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
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="check-out" className="mb-2 block">Check Out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="check-out"
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
                  (checkIn ? date < checkIn : false) || date < new Date()
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="bedrooms" className="mb-2 block">Bedrooms</Label>
          <Select 
            value={bedrooms} 
            onValueChange={(value) => setBedrooms(value)}
          >
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end space-x-2">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min-price" className="mb-2 block">Min Price</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="$"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="max-price" className="mb-2 block">Max Price</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="$"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
