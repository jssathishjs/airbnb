import { supabase } from '../server/supabase';
import { 
  insertAmenitySchema, 
  insertLocationSchema, 
  insertPropertySchema,
  insertPropertyAmenitySchema,
  insertPropertyImageSchema
} from '../shared/schema';

async function main() {
  console.log('Initializing Supabase database tables...');

  try {
    // Create tables
    console.log('Creating tables...');
    await createTables();

    // Seed initial data
    console.log('Seeding data...');
    await seedAmenities();
    await seedLocations();
    await seedProperties();

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

async function createTables() {
  // No need to create tables in Supabase as they're auto-created based on our schema
  // when we insert data with the correct structure
  console.log('Tables will be automatically created on first insert');
}

async function seedAmenities() {
  const amenities = [
    { name: "WiFi", icon: "wifi" },
    { name: "Pool", icon: "swimming" },
    { name: "Hot Tub", icon: "hot-tub" },
    { name: "Kitchen", icon: "utensils" },
    { name: "Free Parking", icon: "parking" },
    { name: "TV", icon: "tv" },
    { name: "Air Conditioning", icon: "snowflake" },
    { name: "Beach Access", icon: "umbrella-beach" },
    { name: "Cleaning Service", icon: "broom" },
    { name: "Workspace", icon: "desk" },
    { name: "Fireplace", icon: "fire" },
    { name: "City View", icon: "city" },
    { name: "Mountain View", icon: "mountain" },
    { name: "Gym", icon: "dumbbell" }
  ];

  const { data, error } = await supabase
    .from('amenities')
    .upsert(amenities, { onConflict: 'name' })
    .select();

  if (error) {
    console.error('Error seeding amenities:', error);
  } else {
    console.log(`Added ${data.length} amenities`);
  }
}

async function seedLocations() {
  const locations = [
    { name: "Malibu", type: "city" },
    { name: "New York", type: "city" },
    { name: "Aspen", type: "city" },
    { name: "Lake Tahoe", type: "city" },
    { name: "Miami", type: "city" },
    { name: "Chicago", type: "city" },
    { name: "California", type: "state" },
    { name: "Colorado", type: "state" },
    { name: "Nevada", type: "state" },
    { name: "Florida", type: "state" },
    { name: "Illinois", type: "state" },
    { name: "New York", type: "state" }
  ];

  const { data, error } = await supabase
    .from('locations')
    .upsert(locations, { onConflict: 'name,type' })
    .select();

  if (error) {
    console.error('Error seeding locations:', error);
  } else {
    console.log(`Added ${data.length} locations`);
  }
}

async function seedProperties() {
  const properties = [
    {
      title: "Luxury Beachfront Villa",
      description: "Experience luxury living in this spectacular beachfront villa with panoramic ocean views. This spacious property offers modern amenities while maintaining a cozy atmosphere for your perfect getaway.",
      location: "Malibu, California",
      price: "350",
      rating: "4.9",
      bedrooms: 4,
      bathrooms: 3,
      main_image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      is_featured: true,
      review_count: 0
    },
    {
      title: "Modern Downtown Apartment",
      description: "Stay in this sleek and stylish apartment in the heart of downtown. Enjoy stunning city views and easy access to all the best restaurants, shopping, and entertainment.",
      location: "New York, New York",
      price: "180",
      rating: "4.7",
      bedrooms: 2,
      bathrooms: 2,
      main_image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      is_featured: true,
      review_count: 0
    },
    {
      title: "Cozy Mountain Cabin",
      description: "Escape to this charming cabin nestled in the mountains. Perfect for a peaceful retreat with beautiful views and outdoor activities right at your doorstep.",
      location: "Aspen, Colorado",
      price: "230",
      rating: "4.8",
      bedrooms: 3,
      bathrooms: 2,
      main_image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      is_featured: true,
      review_count: 0
    },
    {
      title: "Lakefront Cottage",
      description: "Experience tranquility at this beautiful lakefront cottage. Wake up to stunning lake views and enjoy direct access to water activities and hiking trails.",
      location: "Lake Tahoe, Nevada",
      price: "275",
      rating: "4.9",
      bedrooms: 4,
      bathrooms: 2,
      main_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      is_featured: true,
      review_count: 0
    },
    {
      title: "Luxury Poolside Villa",
      description: "Indulge in luxury at this elegant villa with a private pool. Perfect for those seeking privacy and comfort in a beautiful setting.",
      location: "Miami, Florida",
      price: "420",
      rating: "5.0",
      bedrooms: 5,
      bathrooms: 4,
      main_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      is_featured: true,
      review_count: 0
    },
    {
      title: "Urban Studio Loft",
      description: "Stay in this trendy loft in the heart of the city. Great for solo travelers or couples looking to experience urban living at its finest.",
      location: "Chicago, Illinois",
      price: "150",
      rating: "4.6",
      bedrooms: 1,
      bathrooms: 1,
      main_image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      is_featured: true,
      review_count: 0
    }
  ];

  // Insert properties
  const { data: propertyData, error: propertyError } = await supabase
    .from('properties')
    .upsert(properties, { onConflict: 'title' })
    .select();

  if (propertyError) {
    console.error('Error seeding properties:', propertyError);
    return;
  }

  console.log(`Added ${propertyData.length} properties`);

  // Add property images
  for (const property of propertyData) {
    const imageUrls = [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ];
    
    const propertyImages = imageUrls.map(url => ({
      property_id: property.id,
      image_url: url
    }));
    
    const { data: imageData, error: imageError } = await supabase
      .from('property_images')
      .upsert(propertyImages)
      .select();
      
    if (imageError) {
      console.error(`Error adding images for property ${property.id}:`, imageError);
    } else {
      console.log(`Added ${imageData.length} images for property ${property.id}`);
    }
    
    // Get amenities
    const { data: amenityData, error: amenityError } = await supabase
      .from('amenities')
      .select('id')
      .limit(14);
      
    if (amenityError) {
      console.error('Error fetching amenities:', amenityError);
      continue;
    }
    
    // Randomly select 4-6 amenities for each property
    const numAmenities = Math.floor(Math.random() * 3) + 4; // 4-6 amenities
    const selectedAmenityIds = amenityData
      .sort(() => 0.5 - Math.random())
      .slice(0, numAmenities)
      .map(a => a.id);
    
    const propertyAmenities = selectedAmenityIds.map(amenityId => ({
      property_id: property.id,
      amenity_id: amenityId
    }));
    
    const { data: paData, error: paError } = await supabase
      .from('property_amenities')
      .upsert(propertyAmenities)
      .select();
      
    if (paError) {
      console.error(`Error adding amenities for property ${property.id}:`, paError);
    } else {
      console.log(`Added ${paData.length} amenities for property ${property.id}`);
    }
  }
}

// Run the script
main();