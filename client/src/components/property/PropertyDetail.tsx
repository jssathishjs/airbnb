import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  MapPin, 
  Star,
  Wifi,
  Droplets,
  Utensils,
  Car,
  Tv,
  Snowflake,
  Umbrella,
  Fan,
  Dumbbell,
  Flame,
  Building,
  Mountain,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type PropertyWithDetails } from "@shared/schema";
import PropertyGallery from "@/components/property/PropertyGallery";
import BookingCalendar from "@/components/property/BookingCalendar";
import AmenityIcon from "@/components/property/AmenityIcon";
import ContactHost from "@/components/property/ContactHost";

interface PropertyDetailProps {
  propertyId: number;
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const [showContactHost, setShowContactHost] = useState(false);
  
  const { data: property, isLoading, error } = useQuery<PropertyWithDetails>({
    queryKey: [`/api/properties/${propertyId}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-24 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Property
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the property details. Please try again later.
          </p>
          <Button variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }
  
  const iconMap: Record<string, JSX.Element> = {
    "wifi": <Wifi />,
    "swimming": <Droplets />,
    "hot-tub": <Droplets />,
    "utensils": <Utensils />,
    "parking": <Car />,
    "tv": <Tv />,
    "snowflake": <Snowflake />,
    "umbrella-beach": <Umbrella />,
    "broom": <Fan />,
    "dumbbell": <Dumbbell />,
    "fire": <Flame />,
    "city": <Building />,
    "mountain": <Mountain />
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">{property.title}</h1>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{property.location}</span>
          <div className="flex items-center ml-4">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="ml-1">
              {property.rating} ({property.reviews.length} reviews)
            </span>
          </div>
        </div>
      </div>

      <PropertyGallery images={[property.mainImage, ...(property.images?.map(img => img.imageUrl) || [])]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">About this property</h2>
                <p className="text-muted-foreground">{property.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-3">Property Details</h3>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Bedrooms:</span> {property.bedrooms}
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Bathrooms:</span> {property.bathrooms}
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Price:</span> ${property.price}/night
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Location:</span> {property.location}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-3">Customization Options</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Welcome Package</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="welcome-standard" className="mr-2" />
                        <label htmlFor="welcome-standard">Standard Welcome Package (Included)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="welcome-premium" className="mr-2" />
                        <label htmlFor="welcome-premium">Premium Welcome Package (+$50)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="welcome-luxury" className="mr-2" />
                        <label htmlFor="welcome-luxury">Luxury Welcome Package with Local Specialties (+$100)</label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Daily Services</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="daily-cleaning" className="mr-2" />
                        <label htmlFor="daily-cleaning">Daily Cleaning Service (+$40/day)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="chef-service" className="mr-2" />
                        <label htmlFor="chef-service">Private Chef Service (+$150/meal)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="concierge" className="mr-2" />
                        <label htmlFor="concierge">Dedicated Concierge (+$75/day)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="amenities">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map(amenity => (
                  <div key={amenity.id} className="flex items-center">
                    <AmenityIcon name={amenity.icon} className="text-muted-foreground mr-3" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Reviews</h2>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-muted-foreground ml-1">
                      ({property.reviews.length} reviews)
                    </span>
                  </span>
                </div>

                <div className="space-y-6">
                  {property.reviews?.slice(0, 5).map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={review.avatar} alt={review.guestName} />
                          <AvatarFallback>{review.guestName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{review.guestName}</h4>
                          <p className="text-muted-foreground text-sm">
                            {format(new Date(review.date), 'MMMM yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {property.reviews?.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full py-2 border-gray-400"
                  >
                    View All {property.reviews.length} Reviews
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="sticky top-20">
            {showContactHost ? (
              <ContactHost 
                propertyId={property.id} 
                onBack={() => setShowContactHost(false)} 
              />
            ) : (
              <>
                <BookingCalendar 
                  propertyId={property.id} 
                  price={property.price} 
                  title={property.title} 
                />
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-400"
                    onClick={() => setShowContactHost(true)}
                  >
                    Contact Host
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
