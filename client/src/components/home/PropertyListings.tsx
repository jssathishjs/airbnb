import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { type Property } from "@shared/schema";

const filterOptions = [
  { id: "all", label: "All" },
  { id: "beach", label: "Beach Front" },
  { id: "mountain", label: "Mountain View" },
  { id: "urban", label: "Urban" },
  { id: "countryside", label: "Countryside" }
];

export default function PropertyListings() {
  const [filter, setFilter] = useState("all");
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  // In a real application, this would filter from the API
  // For now, we'll just simulate filtering on the client side
  const filteredProperties = properties?.filter(property => {
    if (filter === "all") return true;
    
    // Simple filtering based on the property location or title
    const searchTerms = {
      beach: ["beach", "ocean", "sea", "malibu"],
      mountain: ["mountain", "cabin", "aspen", "ski"],
      urban: ["apartment", "loft", "new york", "chicago"],
      countryside: ["cottage", "retreat", "lake", "forest"]
    };
    
    const terms = searchTerms[filter as keyof typeof searchTerms] || [];
    
    return terms.some(term => 
      property.title.toLowerCase().includes(term) || 
      property.location.toLowerCase().includes(term)
    );
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Featured Properties</h2>
          <Link href="/properties" className="text-primary font-medium hover:underline flex items-center">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              className={
                filter === option.id
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border border-gray-300 hover:border-primary hover:text-primary"
              }
              variant={filter === option.id ? "default" : "outline"}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Failed to load properties</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties && filteredProperties.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No properties found matching the selected filter.</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <Link href="/properties">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Load More Properties
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
