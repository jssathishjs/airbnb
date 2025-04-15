import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Stay?</h2>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Discover handcrafted properties with customization options to create your ideal vacation experience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/properties">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Search Properties
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
              List Your Property
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
