import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleDatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type PropertyWithDetails } from "@shared/schema";

interface BookingFormProps {
  property: PropertyWithDetails;
}

const formSchema = z.object({
  checkIn: z.date({
    required_error: "Please select a check-in date.",
  }),
  checkOut: z.date({
    required_error: "Please select a check-out date.",
  }),
  guests: z.string({
    required_error: "Please select the number of guests.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function BookingForm({ property }: BookingFormProps) {
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: "2",
    },
  });
  
  const { checkIn, checkOut } = form.watch();
  
  // Calculate number of nights and total price
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const subtotal = nights * Number(property.price);
  const cleaningFee = 100;
  const serviceFee = Math.round(subtotal * 0.07); // 7% service fee
  const total = subtotal + cleaningFee + serviceFee;

  const checkAvailabilityMutation = useMutation({
    mutationFn: async (data: { checkIn: string; checkOut: string }) => {
      const response = await apiRequest(
        "POST",
        `/api/properties/${property.id}/check-availability`,
        data
      );
      return response.json();
    },
    onSuccess: (data) => {
      setIsAvailable(data.available);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check availability. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/bookings", {
        propertyId: property.id,
        checkIn: format(data.checkIn, "yyyy-MM-dd"),
        checkOut: format(data.checkOut, "yyyy-MM-dd"),
        guestName: "Guest Name", // In a real app, this would come from the user profile
        guestEmail: "guest@example.com", // In a real app, this would come from the user profile
        totalPrice: total,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your booking has been confirmed.",
      });
      form.reset();
      setIsAvailable(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    checkAvailabilityMutation.mutate({
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
    });
  };

  const onSubmit = (data: FormData) => {
    if (isAvailable) {
      bookingMutation.mutate(data);
    } else {
      handleCheckAvailability();
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">${property.price} <span className="text-muted-foreground font-normal text-base">/ night</span></h3>
          <div className="flex items-center mb-4">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
            <span>{property.rating}</span>
            <span className="text-muted-foreground ml-1">({property.reviews.length} reviews)</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check In</FormLabel>
                    <FormControl>
                      <SingleDatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="Select date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Out</FormLabel>
                    <FormControl>
                      <SingleDatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="Select date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guests</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1} {i === 0 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {checkIn && checkOut && nights > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>${property.price} x {nights} nights</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={bookingMutation.isPending || checkAvailabilityMutation.isPending}
            >
              {bookingMutation.isPending
                ? "Processing..."
                : isAvailable
                ? "Reserve"
                : "Check Availability"}
            </Button>
            
            {isAvailable === false && (
              <p className="text-red-500 text-sm text-center">
                Selected dates are not available. Please choose different dates.
              </p>
            )}
            
            <p className="text-center text-muted-foreground text-sm">
              You won't be charged yet
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
