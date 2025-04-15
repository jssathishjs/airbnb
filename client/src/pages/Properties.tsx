import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Helmet } from 'react-helmet';
import { Property } from "@shared/schema";
import SearchFilters from "@/components/search/SearchFilters";
import PropertyCard from "@/components/property/PropertyCard";
import FilterOptions from "@/components/search/FilterOptions";
import PropertyMap from "@/components/property/PropertyMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Map } from "lucide-react";

export default function Properties() {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  const [view, setView] = useState<"grid" | "map">("grid");
  const [filters, setFilters] = useState({
    amenities: searchParams.get("amenities") 
      ? searchParams.get("amenities")!.split(',').map(id => parseInt(id)) 
      : [],
    propertyType: searchParams.get("propertyType") || "all"
  });
  
  // Add all search params to the query key to refetch when they change
  const queryParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (value) queryParams[key] = value;
  }
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties/search", queryParams],
  });
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [search]);
  
  const handleFilterChange = (newFilters: { amenities: number[]; propertyType: string }) => {
    setFilters(newFilters);
    
    // Update URL without navigating (this would trigger a refetch through the queryKey)
    const newSearchParams = new URLSearchParams(search);
    
    if (newFilters.amenities.length > 0) {
      newSearchParams.set('amenities', newFilters.amenities.join(','));
    } else {
      newSearchParams.delete('amenities');
    }
    
    if (newFilters.propertyType !== 'all') {
      newSearchParams.set('propertyType', newFilters.propertyType);
    } else {
      newSearchParams.delete('propertyType');
    }
    
    // In a real app with proper routing, we would update the URL here
    // window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
  };
  
  // Apply client-side filtering for property type (in a real app, this would be done server-side)
  const filteredProperties = properties?.filter(property => {
    if (filters.propertyType === "all") return true;
    
    const typeMap = {
      house: ["house", "home", "cottage"],
      apartment: ["apartment", "loft", "condo", "studio"],
      cabin: ["cabin", "mountain"],
      villa: ["villa", "mansion", "estate", "luxury"]
    };
    
    const keywords = typeMap[filters.propertyType as keyof typeof typeMap] || [];
    
    return keywords.some(keyword => 
      property.title.toLowerCase().includes(keyword) || 
      property.description.toLowerCase().includes(keyword)
    );
  });

  return (
    <>
      <Helmet>
        <title>Browse Properties | StayVista</title>
        <meta 
          name="description" 
          content="Find the perfect vacation rental from our wide selection of handcrafted properties with customization options." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Find Your Perfect Stay</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            {/* Enhanced search filters */}
            <div className="sticky top-4">
              <SearchFilters />
              
              <div className="mt-6">
                <FilterOptions 
                  onFilterChange={handleFilterChange}
                  initialAmenities={filters.amenities}
                  initialPropertyType={filters.propertyType}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <p className="text-muted-foreground">
                  {filteredProperties ? `${filteredProperties.length} properties found` : 'Loading properties...'}
                </p>
              </div>
              
              <Tabs value={view} onValueChange={(value) => setView(value as "grid" | "map")}>
                <TabsList className="grid w-[180px] grid-cols-2">
                  <TabsTrigger value="grid">
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="map">
                    <Map className="h-4 w-4 mr-2" />
                    Map
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProperties?.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="map" className="mt-0">
                  <PropertyMap location="All Properties" />
                </TabsContent>
              </>
            )}
            
            {filteredProperties && filteredProperties.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No properties found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
