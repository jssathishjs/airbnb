import { 
  HeartHandshake, 
  ShieldCheck, 
  MessageSquare 
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="text-center p-6">
      <div className="text-primary text-4xl mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">Why Choose StayVista?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<HeartHandshake size={32} />}
            title="Handcrafted Experience"
            description="Each property is carefully selected and customizable to meet your specific needs."
          />
          <Feature
            icon={<ShieldCheck size={32} />}
            title="Secure Booking"
            description="Our platform ensures your booking and payment process is safe and protected."
          />
          <Feature
            icon={<MessageSquare size={32} />}
            title="Direct Host Communication"
            description="Connect directly with property owners to discuss your stay requirements."
          />
        </div>
      </div>
    </section>
  );
}
