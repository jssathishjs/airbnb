import { useMemo } from "react";

interface PropertyMapProps {
  location: string;
}

export default function PropertyMap({ location }: PropertyMapProps) {
  // Since we don't have an actual map API integration, we'll display a placeholder
  // In a real application, this would be replaced with a Google Maps or Mapbox component
  const locationDetails = useMemo(() => {
    const locationParts = location.split(", ");
    return {
      city: locationParts[0],
      state: locationParts[1],
    };
  }, [location]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-primary mx-auto mb-4">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p className="text-lg font-semibold mb-2">{locationDetails.city}</p>
          <p className="text-muted-foreground mb-4">{locationDetails.state}</p>
          <p className="text-muted-foreground">
            Interactive map showing property location would be displayed here using Google Maps or Mapbox integration
          </p>
        </div>
      </div>
    </div>
  );
}
