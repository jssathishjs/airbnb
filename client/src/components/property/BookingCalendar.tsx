import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { DateRange } from "react-day-picker";

interface BookingCalendarProps {
  propertyId: number;
  price: string;
  title: string;
}

export default function BookingCalendar({ propertyId, price, title }: BookingCalendarProps) {
  const { toast } = useToast();
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5)
  });
  
  const [numGuests, setNumGuests] = useState(1);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const { mutate: checkAvailability, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      if (!selectedRange?.from || !selectedRange?.to) {
        throw new Error('Please select a date range');
      }
      
      const response = await apiRequest(`/api/properties/${propertyId}/check-availability`, {
        method: 'POST',
        body: JSON.stringify({
          checkIn: format(selectedRange.from, 'yyyy-MM-dd'),
          checkOut: format(selectedRange.to, 'yyyy-MM-dd')
        })
      });
      
      return { available: response.ok };
    },
    onSuccess: (data) => {
      if (data.available) {
        toast({
          title: 'Dates Available!',
          description: 'The property is available for your selected dates',
        });
      } else {
        toast({
          title: 'Not Available',
          description: 'The property is not available for these dates. Please select different dates.',
          variant: 'destructive'
        });
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to check availability. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  const { mutate: createBooking, isPending: isBooking } = useMutation({
    mutationFn: async () => {
      if (!selectedRange?.from || !selectedRange?.to) {
        throw new Error('Please select a date range');
      }
      
      if (!contactInfo.name || !contactInfo.email) {
        throw new Error('Please provide your name and email');
      }
      
      return await apiRequest(`/api/bookings`, {
        method: 'POST',
        body: JSON.stringify({
          propertyId,
          checkIn: format(selectedRange.from, 'yyyy-MM-dd'),
          checkOut: format(selectedRange.to, 'yyyy-MM-dd'),
          guestName: contactInfo.name,
          guestEmail: contactInfo.email,
          guestPhone: contactInfo.phone || null,
          totalPrice: calculateTotalPrice(),
          message: contactInfo.message || '',
          guests: numGuests
        })
      });
    },
    onSuccess: () => {
      toast({
        title: 'Booking Successful',
        description: 'Your booking has been created! You will receive a confirmation email shortly.',
      });
      
      // Reset form
      setSelectedRange({
        from: new Date(),
        to: addDays(new Date(), 5)
      });
      setNumGuests(1);
      setContactInfo({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/properties', propertyId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  const calculateTotalPrice = () => {
    if (!selectedRange?.from || !selectedRange?.to) return "0";
    
    const numNights = differenceInDays(selectedRange.to, selectedRange.from);
    const priceValue = parseFloat(price);
    
    return (numNights * priceValue).toFixed(2);
  };
  
  const totalPrice = calculateTotalPrice();
  const numNights = selectedRange?.from && selectedRange?.to ? 
    differenceInDays(selectedRange.to, selectedRange.from) : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Book this property</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Your stay</Label>
          <CalendarComponent
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            numberOfMonths={1}
            disabled={(date) => date < new Date()}
            className="rounded-md border mt-2"
          />
        </div>
        
        <div className="py-4 border-t border-b">
          <div className="flex justify-between">
            <div className="font-medium">
              ${price} × {numNights} nights
            </div>
            <div>${totalPrice}</div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="font-medium">Total</div>
            <div className="font-bold">${totalPrice}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="numGuests">Number of guests</Label>
            <Input
              id="numGuests"
              type="number"
              min={1}
              max={10}
              value={numGuests}
              onChange={(e) => setNumGuests(parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message to host (optional)</Label>
            <Textarea
              id="message"
              value={contactInfo.message}
              onChange={(e) => setContactInfo({...contactInfo, message: e.target.value})}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          disabled={isBooking || !selectedRange?.from || !selectedRange?.to}
          onClick={() => createBooking()}
        >
          {isBooking ? 'Creating Booking...' : 'Book Now'}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          disabled={isChecking || !selectedRange?.from || !selectedRange?.to}
          onClick={() => checkAvailability()}
        >
          {isChecking ? 'Checking...' : 'Check Availability'}
        </Button>
      </CardFooter>
    </Card>
  );
}