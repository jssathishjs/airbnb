import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">StaySpaces</h3>
            <p className="text-gray-400">
              Find your perfect vacation rental with customization options for a truly personalized experience.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-white">Home</a></Link></li>
              <li><Link href="/properties"><a className="text-gray-400 hover:text-white">Properties</a></Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Destinations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Customization Options</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Reviews</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Host</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">List Your Property</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Host Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Community Forum</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Hosting Responsibly</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-white">Contact Us</a></Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cancellation Options</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Trust & Safety</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} StaySpaces. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
