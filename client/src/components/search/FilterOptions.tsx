import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type Amenity } from "@shared/schema";

interface FilterOptionsProps {
  onFilterChange: (filters: {
    amenities: number[];
    propertyType: string;
  }) => void;
  initialAmenities?: number[];
  initialPropertyType?: string;
}

const propertyTypes = [
  { id: "all", label: "All Properties" },
  { id: "house", label: "Houses" },
  { id: "apartment", label: "Apartments" },
  { id: "cabin", label: "Cabins" },
  { id: "villa", label: "Villas" }
];

export default function FilterOptions({
  onFilterChange,
  initialAmenities = [],
  initialPropertyType = "all"
}: FilterOptionsProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(initialAmenities);
  const [propertyType, setPropertyType] = useState(initialPropertyType);

  const { data: amenities, isLoading } = useQuery<Amenity[]>({
    queryKey: ["/api/amenities"],
  });

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    let newSelectedAmenities;
    
    if (checked) {
      newSelectedAmenities = [...selectedAmenities, amenityId];
    } else {
      newSelectedAmenities = selectedAmenities.filter(id => id !== amenityId);
    }
    
    setSelectedAmenities(newSelectedAmenities);
    onFilterChange({
      amenities: newSelectedAmenities,
      propertyType
    });
  };

  const handlePropertyTypeChange = (type: string) => {
    setPropertyType(type);
    onFilterChange({
      amenities: selectedAmenities,
      propertyType: type
    });
  };

  const handleClearFilters = () => {
    setSelectedAmenities([]);
    setPropertyType("all");
    onFilterChange({
      amenities: [],
      propertyType: "all"
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="text-primary hover:text-primary/80"
        >
          Clear All
        </Button>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Property Type</h4>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map(type => (
            <Button
              key={type.id}
              variant={propertyType === type.id ? "default" : "outline"}
              className={propertyType === type.id 
                ? "bg-primary text-white" 
                : "bg-white text-foreground border border-gray-300 hover:border-primary hover:text-primary"
              }
              onClick={() => handlePropertyTypeChange(type.id)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <h4 className="font-medium mb-3">Amenities</h4>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-6 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {amenities?.map(amenity => (
              <div key={amenity.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`amenity-${amenity.id}`}
                  checked={selectedAmenities.includes(amenity.id)}
                  onCheckedChange={(checked) => 
                    handleAmenityChange(amenity.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`amenity-${amenity.id}`}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {amenity.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
