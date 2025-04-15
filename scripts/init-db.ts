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

  console.log('Attempting to add amenities to Supabase...');
  try {
    const { data, error } = await supabase
      .from('amenities')
      .upsert(amenities, { onConflict: 'name' })
      .select();

    if (error) {
      console.error('Error seeding amenities:', error);
      // Let's try a simple insert to see if that works
      const insertResult = await supabase
        .from('amenities')
        .insert([{ name: "Test Amenity", icon: "test" }]);
      
      console.log('Simple insert test result:', insertResult);
    } else {
      console.log(`Added ${data?.length || 0} amenities`);
    }
  } catch (e) {
    console.error('Exception adding amenities:', e);
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

  console.log('Attempting to add locations to Supabase...');
  try {
    const { data, error } = await supabase
      .from('locations')
      .upsert(locations, { onConflict: 'name,type' })
      .select();

    if (error) {
      console.error('Error seeding locations:', error);
      // Let's try a simple insert to see if that works
      const insertResult = await supabase
        .from('locations')
        .insert([{ name: "Test Location", type: "test" }]);
      
      console.log('Simple insert test result:', insertResult);
    } else {
      console.log(`Added ${data?.length || 0} locations`);
    }
  } catch (e) {
    console.error('Exception adding locations:', e);
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
    }
  ];

  console.log('Attempting to add properties to Supabase...');
  try {
    // Insert properties
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .upsert(properties, { onConflict: 'title' })
      .select();

    if (propertyError) {
      console.error('Error seeding properties:', propertyError);
      
      // Let's try a simple insert to see if that works
      const insertResult = await supabase
        .from('properties')
        .insert([{
          title: "Test Property",
          description: "Test description",
          location: "Test location",
          price: "100",
          rating: "5.0",
          bedrooms: 1,
          bathrooms: 1,
          main_image: "https://example.com/image.jpg",
          is_featured: false,
          review_count: 0
        }]);
      
      console.log('Simple property insert test result:', insertResult);
      return;
    }

    console.log(`Added ${propertyData?.length || 0} properties`);

    if (!propertyData || propertyData.length === 0) {
      console.log('No properties added, skipping related data');
      return;
    }

    // Add property images for the first property only for simplicity
    const property = propertyData[0];
    console.log('Working with property:', property);
    
    const imageUrls = [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ];
    
    const propertyImages = imageUrls.map(url => ({
      property_id: property.id,
      image_url: url
    }));
    
    console.log('Attempting to add property images:', propertyImages);
    const { data: imageData, error: imageError } = await supabase
      .from('property_images')
      .upsert(propertyImages)
      .select();
      
    if (imageError) {
      console.error(`Error adding images for property ${property.id}:`, imageError);
    } else {
      console.log(`Added ${imageData?.length || 0} images for property ${property.id}`);
    }
  } catch (e) {
    console.error('Exception adding properties or related data:', e);
  }
}

// Run the script
main();