import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="bg-gradient-to-r from-teal-500 to-primary rounded-xl overflow-hidden shadow-xl">
        <div className="md:flex items-center">
          <div className="md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white">Ready to Find Your Perfect Getaway?</h2>
            <p className="mt-4 text-white/90 text-lg">
              Join thousands of happy travelers who have found their dream vacation rentals with customized experiences through our platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/properties">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Browse Properties
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                List Your Property
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Vacation rental" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
