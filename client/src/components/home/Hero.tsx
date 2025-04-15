import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50 z-10"></div>
      <div 
        className="h-[500px] w-full bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
      ></div>
      <div className="absolute inset-0 flex items-center z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              Find Your Perfect Vacation Rental
            </h1>
            <p className="mt-4 text-white text-lg md:text-xl">
              Discover handpicked properties with customization options for your dream getaway
            </p>
            <div className="mt-8">
              <Link href="#search">
                <a className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-md inline-block">
                  Explore Properties
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
