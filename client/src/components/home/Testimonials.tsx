import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialProps {
  rating: number;
  content: string;
  author: {
    name: string;
    image: string;
    property: string;
  };
}

const testimonials: TestimonialProps[] = [
  {
    rating: 5,
    content: "We loved the ability to customize our stay. The welcome package with local specialties was the perfect way to start our vacation, and the host's recommendations were spot on!",
    author: {
      name: "Emily R.",
      image: "https://randomuser.me/api/portraits/women/24.jpg",
      property: "Lake Tahoe Property"
    }
  },
  {
    rating: 5,
    content: "The property was exactly as described and the customization options made our anniversary special. We opted for the romantic beach dinner setup and it was absolutely magical.",
    author: {
      name: "David T.",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      property: "Malibu Villa"
    }
  },
  {
    rating: 5,
    content: "StayVista made finding and booking our vacation rental so easy. The communication with the host was seamless, and the property exceeded our expectations in every way.",
    author: {
      name: "Jessica K.",
      image: "https://randomuser.me/api/portraits/women/67.jpg",
      property: "New York Apartment"
    }
  }
];

function Testimonial({ rating, content, author }: TestimonialProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground mb-4">{content}</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{author.name}</h4>
            <p className="text-muted-foreground text-sm">{author.property}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">What Our Guests Are Saying</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
