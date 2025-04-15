import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    stars: 5,
    text: "Our stay was absolutely perfect! The property was exactly as described, and the customization options for our stay were a wonderful touch. Will definitely book again!"
  },
  {
    id: 2,
    name: "David M.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    stars: 4.5,
    text: "The property was clean, beautifully decorated, and in a perfect location. The host was responsive and accommodating to all our requests. Highly recommend!"
  },
  {
    id: 3,
    name: "Emily R.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    stars: 5,
    text: "We loved being able to customize our stay with additional amenities. It made our family vacation so much more enjoyable. The property was stunning and exactly as pictured."
  }
];

const Testimonials = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What Our Guests Say</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                <div className="flex text-yellow-400">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-current" 
                      fill={i < Math.floor(testimonial.stars) ? "currentColor" : "none"}
                      fillOpacity={i >= Math.floor(testimonial.stars) && i < testimonial.stars ? "0.5" : "1"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-800">
              "{testimonial.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
