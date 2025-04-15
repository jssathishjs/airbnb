import { useQuery } from "@tanstack/react-query";
import PropertyCard from "@/components/properties/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

const RecentlyAdded = () => {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["/api/properties/recent"],
  });

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
        <Skeleton className="h-64 w-full" />
        <div className="p-5">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    ));
  };

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Added</h2>
        <div className="text-center p-8 bg-red-50 text-red-500 rounded-lg">
          Error loading recent properties. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Added</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          renderSkeletons()
        ) : (
          properties?.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              showNewBadge={true} 
            />
          ))
        )}
      </div>
    </section>
  );
};

export default RecentlyAdded;
