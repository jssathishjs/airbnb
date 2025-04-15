import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { type Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`}>
      <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-64">
          <img
            src={property.mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.isFeatured && (
            <Badge className="absolute top-4 right-4 bg-white text-primary">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="ml-1">{property.rating}</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-3">{property.location}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
              {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
              {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
            </Badge>
            {/* The location type can be inferred from the location string */}
            {property.location.includes("Malibu") || property.location.includes("Miami") ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                Beachfront
              </Badge>
            ) : property.location.includes("Aspen") ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                Mountain
              </Badge>
            ) : property.location.includes("New York") || property.location.includes("Chicago") ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                City View
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                Lakefront
              </Badge>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">
              ${property.price} <span className="text-muted-foreground font-normal">/ night</span>
            </p>
            <span className="text-primary hover:underline">View details</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
