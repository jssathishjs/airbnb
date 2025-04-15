import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import PropertyListings from "@/components/home/PropertyListings";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>StayVista - Find Your Perfect Vacation Rental</title>
        <meta 
          name="description" 
          content="Discover and book unique handcrafted vacation rentals with customization options for your perfect stay." 
        />
      </Helmet>

      <Hero />
      <Features />
      <PropertyListings />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">Explore Properties by Location</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-16 w-16 mx-auto mb-4">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <p className="text-muted-foreground mb-4">Interactive map showing property locations will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Testimonials />
      <CallToAction />
    </>
  );
}
