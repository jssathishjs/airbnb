import { useEffect } from "react";
import { useRoute } from "wouter";
import { Helmet } from 'react-helmet';
import PropertyDetail from "@/components/property/PropertyDetail";

export default function PropertyDetailPage() {
  const [match, params] = useRoute("/property/:id");
  const propertyId = match ? parseInt(params.id) : 0;
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [propertyId]);

  if (!match) return null;

  return (
    <>
      <Helmet>
        <title>Property Details | StayVista</title>
        <meta 
          name="description" 
          content="View detailed information about this vacation rental property including amenities, availability, and booking options." 
        />
      </Helmet>

      <PropertyDetail propertyId={propertyId} />
    </>
  );
}
