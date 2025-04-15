import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// In a real implementation, this would use a proper map library like Mapbox or Google Maps
const LocationMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Simulate map loading
  setTimeout(() => {
    setIsMapLoaded(true);
  }, 1000);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="bg-white rounded-xl overflow-hidden shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Explore Destinations</h2>
          <p className="text-gray-500 mt-2">Find properties in these popular locations</p>
        </div>
        <div className="h-[500px] relative">
          {!isMapLoaded ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <>
              <img 
                src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
                alt="Map view" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="bg-white/80 px-4 py-2 rounded-lg shadow text-center">
                  In a real implementation, an interactive map would be displayed here.
                </p>
              </div>
              
              {/* Property markers */}
              <div className="absolute top-1/4 left-1/3">
                <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <span className="font-medium">3</span>
                </div>
              </div>
              <div className="absolute top-1/2 left-2/3">
                <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <span className="font-medium">5</span>
                </div>
              </div>
              <div className="absolute top-3/4 left-1/4">
                <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <span className="font-medium">2</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
