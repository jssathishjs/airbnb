import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Properties", path: "/properties" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "About", path: "/about" },
];

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener when component mounts
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      isScrolled 
        ? "bg-white shadow-sm" 
        : "bg-white/80 backdrop-blur-sm"
    )}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-primary text-2xl font-bold">StayVista</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-foreground hover:text-primary font-medium transition",
                location === item.path && "text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact">
            <Button className="bg-primary text-white hover:bg-primary/90 transition">
              List Your Property
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "text-foreground hover:text-primary font-medium text-lg py-2 transition",
                      location === item.path && "text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/contact">
                  <Button className="w-full mt-4 bg-primary text-white hover:bg-primary/90 transition">
                    List Your Property
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
