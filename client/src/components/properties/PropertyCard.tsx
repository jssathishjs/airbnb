import { useState } from "react";
import { Link } from "wouter";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PropertyCardProps = {
  property: any;
  showNewBadge?: boolean;
};

const PropertyCard = ({ property, showNewBadge = false }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const mainImage = property.imageUrls && property.imageUrls.length > 0 
    ? property.imageUrls[0] 
    : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="property-card bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img 
          src={mainImage} 
          alt={property.title} 
          className="w-full h-64 object-cover"
        />
        {(showNewBadge && property.isNew) && (
          <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
            New
          </div>
        )}
        <button 
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-5 w-5", isFavorite ? "fill-primary text-primary" : "text-primary")} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{property.title}</h3>
            <p className="text-gray-500 mt-1">{property.location}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
            <span className="font-medium">
              {property.isNew && !property.rating ? "New" : property.rating}
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
          </Badge>
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
          </Badge>
          {property.amenities && property.amenities.slice(0, 2).map((amenity: string, index: number) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800">
              {amenity}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-800">${property.price}</span>
            <span className="text-gray-800"> / night</span>
          </div>
          <Link href={`/properties/${property.id}`}>
            <a className="text-teal-600 hover:text-primary font-medium">View details</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
