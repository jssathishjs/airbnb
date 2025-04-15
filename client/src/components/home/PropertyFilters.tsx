import { useState } from "react";
import { Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
  <Button
    variant={isActive ? "default" : "outline"}
    className={`whitespace-nowrap px-4 py-2 rounded-full ${
      isActive ? "bg-primary text-white" : "text-gray-800 border-gray-300"
    }`}
    onClick={onClick}
  >
    {label}
  </Button>
);

const PropertyFilters = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <FilterButton
            label={<><Sliders className="h-4 w-4 mr-2 inline" />All Filters</>}
            isActive={false}
            onClick={() => {}}
          />
          <FilterButton
            label="Price Range"
            isActive={activeFilters.includes("price")}
            onClick={() => toggleFilter("price")}
          />
          <FilterButton
            label="Beachfront"
            isActive={activeFilters.includes("beachfront")}
            onClick={() => toggleFilter("beachfront")}
          />
          <FilterButton
            label="Pool"
            isActive={activeFilters.includes("pool")}
            onClick={() => toggleFilter("pool")}
          />
          <FilterButton
            label="Pet Friendly"
            isActive={activeFilters.includes("pet-friendly")}
            onClick={() => toggleFilter("pet-friendly")}
          />
          <FilterButton
            label="Entire Homes"
            isActive={activeFilters.includes("entire-homes")}
            onClick={() => toggleFilter("entire-homes")}
          />
        </div>
        <div className="flex items-center">
          <span className="text-gray-800 mr-2">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="highest-rated">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default PropertyFilters;
