import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const FeaturedDestinations = () => {
  const { data: destinations, isLoading, error } = useQuery({
    queryKey: ["/api/destinations/featured"],
  });

  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, index) => (
      <div key={index} className="relative rounded-xl overflow-hidden">
        <Skeleton className="w-full h-48" />
      </div>
    ));
  };

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Destinations</h2>
        <div className="text-center p-8 bg-red-50 text-red-500 rounded-lg">
          Error loading destinations. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Destinations</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          renderSkeletons()
        ) : (
          destinations?.map((destination) => (
            <Link 
              key={destination.id} 
              href={`/properties?location=${encodeURIComponent(destination.name)}`}
            >
              <a className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img 
                  src={destination.imageUrl} 
                  alt={destination.name} 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{destination.name}</h3>
                  <p className="text-white/90 text-sm">{destination.propertyCount} properties</p>
                </div>
              </a>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedDestinations;
