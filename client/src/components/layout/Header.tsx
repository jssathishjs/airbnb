import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-primary font-bold text-2xl">StaySpaces</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`px-3 py-2 font-medium ${location === "/" ? "text-primary" : "text-gray-800 hover:text-primary"}`}>
                Home
              </a>
            </Link>
            <Link href="/properties">
              <a className={`px-3 py-2 font-medium ${location === "/properties" ? "text-primary" : "text-gray-800 hover:text-primary"}`}>
                Properties
              </a>
            </Link>
            <Link href="/about">
              <a className={`px-3 py-2 font-medium ${location === "/about" ? "text-primary" : "text-gray-800 hover:text-primary"}`}>
                About Us
              </a>
            </Link>
            <Link href="/contact">
              <a className={`px-3 py-2 font-medium ${location === "/contact" ? "text-primary" : "text-gray-800 hover:text-primary"}`}>
                Contact
              </a>
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-800 font-medium">Login</Button>
            <Button className="bg-primary text-white hover:bg-primary/90">Sign Up</Button>
          </div>
          <div className="md:hidden flex items-center">
            <Button variant="ghost" onClick={toggleMenu} size="icon">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a 
                className={`block px-3 py-2 text-base font-medium ${location === "/" ? "text-primary" : "text-gray-800 hover:bg-gray-50"}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/properties">
              <a 
                className={`block px-3 py-2 text-base font-medium ${location === "/properties" ? "text-primary" : "text-gray-800 hover:bg-gray-50"}`}
                onClick={() => setIsOpen(false)}
              >
                Properties
              </a>
            </Link>
            <Link href="/about">
              <a 
                className={`block px-3 py-2 text-base font-medium ${location === "/about" ? "text-primary" : "text-gray-800 hover:bg-gray-50"}`}
                onClick={() => setIsOpen(false)}
              >
                About Us
              </a>
            </Link>
            <Link href="/contact">
              <a 
                className={`block px-3 py-2 text-base font-medium ${location === "/contact" ? "text-primary" : "text-gray-800 hover:bg-gray-50"}`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
            </Link>
            <div className="flex space-x-2 mt-3 px-3">
              <Button variant="outline" className="flex-1 text-gray-800 border-gray-300 hover:bg-gray-50">Login</Button>
              <Button className="flex-1 bg-primary text-white hover:bg-primary/90">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
