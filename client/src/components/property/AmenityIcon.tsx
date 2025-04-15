import {
  Wifi,
  Droplet,
  Utensils,
  Car,
  Tv,
  Snowflake,
  Umbrella,
  Fan,
  Dumbbell,
  Flame,
  Building,
  Mountain,
  SquareCode
} from "lucide-react";

interface AmenityIconProps {
  name: string;
  className?: string;
}

export default function AmenityIcon({ name, className }: AmenityIconProps) {
  switch (name) {
    case "wifi":
      return <Wifi className={className} />;
    case "swimming":
    case "hot-tub":
      return <Droplet className={className} />;
    case "utensils":
      return <Utensils className={className} />;
    case "parking":
      return <Car className={className} />;
    case "tv":
      return <Tv className={className} />;
    case "snowflake":
      return <Snowflake className={className} />;
    case "umbrella-beach":
      return <Umbrella className={className} />;
    case "broom":
      return <Fan className={className} />;
    case "dumbbell":
      return <Dumbbell className={className} />;
    case "fire":
      return <Flame className={className} />;
    case "city":
      return <Building className={className} />;
    case "mountain":
      return <Mountain className={className} />;
    default:
      return <SquareCode className={className} />;
  }
}
