import {
  properties, propertyImages, amenities, propertyAmenities, bookings, 
  contacts, locations, reviews, type Property, type InsertProperty,
  type PropertyImage, type InsertPropertyImage, type Amenity, 
  type InsertAmenity, type PropertyAmenity, type InsertPropertyAmenity,
  type Booking, type InsertBooking, type Contact, type InsertContact,
  type Location, type InsertLocation, type Review, type InsertReview,
  type PropertyWithDetails
} from "@shared/schema";
import { db } from "./db";
import { and, eq, gte, lte, like, inArray, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Property operations
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<PropertyWithDetails | undefined>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  searchProperties(searchParams: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: number[];
  }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Property images
  getPropertyImages(propertyId: number): Promise<PropertyImage[]>;
  addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage>;
  
  // Amenities
  getAmenities(): Promise<Amenity[]>;
  getPropertyAmenities(propertyId: number): Promise<Amenity[]>;
  addAmenity(amenity: InsertAmenity): Promise<Amenity>;
  addPropertyAmenity(propertyAmenity: InsertPropertyAmenity): Promise<PropertyAmenity>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getPropertyBookings(propertyId: number): Promise<Booking[]>;
  checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  
  // Reviews
  getPropertyReviews(propertyId: number): Promise<Review[]>;
  addReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private propertiesData: Map<number, Property>;
  private propertyImagesData: Map<number, PropertyImage[]>;
  private amenitiesData: Map<number, Amenity>;
  private propertyAmenitiesData: Map<number, number[]>; // propertyId -> amenityIds
  private bookingsData: Map<number, Booking>;
  private contactsData: Map<number, Contact>;
  private locationsData: Map<number, Location>;
  private reviewsData: Map<number, Review[]>;
  
  private propertyIdCounter: number;
  private propertyImageIdCounter: number;
  private amenityIdCounter: number;
  private propertyAmenityIdCounter: number;
  private bookingIdCounter: number;
  private contactIdCounter: number;
  private locationIdCounter: number;
  private reviewIdCounter: number;
  
  constructor() {
    this.propertiesData = new Map();
    this.propertyImagesData = new Map();
    this.amenitiesData = new Map();
    this.propertyAmenitiesData = new Map();
    this.bookingsData = new Map();
    this.contactsData = new Map();
    this.locationsData = new Map();
    this.reviewsData = new Map();
    
    this.propertyIdCounter = 1;
    this.propertyImageIdCounter = 1;
    this.amenityIdCounter = 1;
    this.propertyAmenityIdCounter = 1;
    this.bookingIdCounter = 1;
    this.contactIdCounter = 1;
    this.locationIdCounter = 1;
    this.reviewIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Sample amenities
    const amenitiesList: InsertAmenity[] = [
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
    
    amenitiesList.forEach(amenity => this.addAmenity(amenity));
    
    // Sample locations
    const locationsList: InsertLocation[] = [
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
    
    locationsList.forEach(location => {
      const id = this.locationIdCounter++;
      this.locationsData.set(id, { ...location, id });
    });
    
    // Sample properties with images and amenities
    const propertiesList: InsertProperty[] = [
      {
        title: "Luxury Beachfront Villa",
        description: "Experience luxury living in this spectacular beachfront villa with panoramic ocean views. This spacious property offers modern amenities while maintaining a cozy atmosphere for your perfect getaway.",
        location: "Malibu, California",
        price: 350,
        rating: 4.9,
        bedrooms: 4,
        bathrooms: 3,
        mainImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        title: "Modern Downtown Apartment",
        description: "Stay in this sleek and stylish apartment in the heart of downtown. Enjoy stunning city views and easy access to all the best restaurants, shopping, and entertainment.",
        location: "New York, New York",
        price: 180,
        rating: 4.7,
        bedrooms: 2,
        bathrooms: 2,
        mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        title: "Cozy Mountain Cabin",
        description: "Escape to this charming cabin nestled in the mountains. Perfect for a peaceful retreat with beautiful views and outdoor activities right at your doorstep.",
        location: "Aspen, Colorado",
        price: 230,
        rating: 4.8,
        bedrooms: 3,
        bathrooms: 2,
        mainImage: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        title: "Lakefront Cottage",
        description: "Experience tranquility at this beautiful lakefront cottage. Wake up to stunning lake views and enjoy direct access to water activities and hiking trails.",
        location: "Lake Tahoe, Nevada",
        price: 275,
        rating: 4.9,
        bedrooms: 4,
        bathrooms: 2,
        mainImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        title: "Luxury Poolside Villa",
        description: "Indulge in luxury at this elegant villa with a private pool. Perfect for those seeking privacy and comfort in a beautiful setting.",
        location: "Miami, Florida",
        price: 420,
        rating: 5.0,
        bedrooms: 5,
        bathrooms: 4,
        mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        title: "Urban Studio Loft",
        description: "Stay in this trendy loft in the heart of the city. Great for solo travelers or couples looking to experience urban living at its finest.",
        location: "Chicago, Illinois",
        price: 150,
        rating: 4.6,
        bedrooms: 1,
        bathrooms: 1,
        mainImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        title: "Secluded Forest Retreat",
        description: "Find peace and quiet in this secluded cabin surrounded by forest. Perfect for nature lovers and those seeking to unplug.",
        location: "Portland, Oregon",
        price: 195,
        rating: 4.7,
        bedrooms: 2,
        bathrooms: 1,
        mainImage: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: false
      },
      {
        title: "Charming Historic Townhouse",
        description: "Experience the charm of this beautifully renovated historic townhouse. Combining classic architecture with modern amenities.",
        location: "Boston, Massachusetts",
        price: 240,
        rating: 4.8,
        bedrooms: 3,
        bathrooms: 2,
        mainImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isFeatured: false
      }
    ];
    
    propertiesList.forEach(property => {
      const newProperty = this.createProperty(property);
      
      // Add property images
      const imageUrls = [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ];
      
      imageUrls.forEach(url => {
        this.addPropertyImage({
          propertyId: newProperty.id,
          imageUrl: url
        });
      });
      
      // Add property amenities
      // Randomly select 4-6 amenities for each property
      const amenityIds = Array.from({ length: this.amenityIdCounter - 1 }, (_, i) => i + 1);
      const numAmenities = Math.floor(Math.random() * 3) + 4; // 4-6 amenities
      const selectedAmenityIds = amenityIds
        .sort(() => 0.5 - Math.random())
        .slice(0, numAmenities);
      
      selectedAmenityIds.forEach(amenityId => {
        this.addPropertyAmenity({
          propertyId: newProperty.id,
          amenityId
        });
      });
      
      // Add sample reviews
      const reviewsCount = newProperty.reviewCount || Math.floor(Math.random() * 10) + 5;
      const reviewers = [
        { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
        { name: "Michael Davis", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Emily Richards", avatar: "https://randomuser.me/api/portraits/women/24.jpg" },
        { name: "David Thompson", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
        { name: "Jessica Kim", avatar: "https://randomuser.me/api/portraits/women/67.jpg" }
      ];
      
      const comments = [
        "Beautiful property with stunning views. The customizable options made it feel like a truly personalized experience.",
        "This villa exceeded all our expectations! The location is absolutely perfect and the customization options made our stay even more special.",
        "We loved staying here. The amenities were top-notch and the location was perfect for our needs.",
        "Wonderful experience from start to finish. The property was exactly as described and the host was very responsive.",
        "Great location and beautiful property. We'll definitely be coming back!"
      ];
      
      for (let i = 0; i < reviewsCount; i++) {
        const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
        const comment = comments[Math.floor(Math.random() * comments.length)];
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 rating
        
        this.addReview({
          propertyId: newProperty.id,
          guestName: reviewer.name,
          rating,
          comment,
          avatar: reviewer.avatar
        });
      }
    });
  }
  
  // Property operations
  async getProperties(): Promise<Property[]> {
    return Array.from(this.propertiesData.values());
  }
  
  async getProperty(id: number): Promise<PropertyWithDetails | undefined> {
    const property = this.propertiesData.get(id);
    if (!property) return undefined;
    
    const images = await this.getPropertyImages(id);
    const amenities = await this.getPropertyAmenities(id);
    const reviews = await this.getPropertyReviews(id);
    
    return {
      ...property,
      images,
      amenities,
      reviews
    };
  }
  
  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    return Array.from(this.propertiesData.values())
      .filter(property => property.isFeatured)
      .slice(0, limit);
  }
  
  async searchProperties(searchParams: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: number[];
  }): Promise<Property[]> {
    let filteredProperties = Array.from(this.propertiesData.values());
    
    if (searchParams.location) {
      filteredProperties = filteredProperties.filter(property => 
        property.location.toLowerCase().includes(searchParams.location!.toLowerCase())
      );
    }
    
    if (searchParams.minPrice !== undefined) {
      filteredProperties = filteredProperties.filter(property => 
        Number(property.price) >= searchParams.minPrice!
      );
    }
    
    if (searchParams.maxPrice !== undefined) {
      filteredProperties = filteredProperties.filter(property => 
        Number(property.price) <= searchParams.maxPrice!
      );
    }
    
    if (searchParams.bedrooms !== undefined) {
      filteredProperties = filteredProperties.filter(property => 
        property.bedrooms >= searchParams.bedrooms!
      );
    }
    
    if (searchParams.bathrooms !== undefined) {
      filteredProperties = filteredProperties.filter(property => 
        property.bathrooms >= searchParams.bathrooms!
      );
    }
    
    if (searchParams.amenities && searchParams.amenities.length > 0) {
      filteredProperties = await Promise.all(
        filteredProperties.map(async property => {
          const propertyAmenities = await this.getPropertyAmenities(property.id);
          const propertyAmenityIds = propertyAmenities.map(a => a.id);
          
          const hasAllRequiredAmenities = searchParams.amenities!.every(
            amenityId => propertyAmenityIds.includes(amenityId)
          );
          
          return { property, hasAllRequiredAmenities };
        })
      ).then(results => 
        results
          .filter(result => result.hasAllRequiredAmenities)
          .map(result => result.property)
      );
    }
    
    if (searchParams.checkIn && searchParams.checkOut) {
      filteredProperties = await Promise.all(
        filteredProperties.map(async property => {
          const isAvailable = await this.checkAvailability(
            property.id,
            searchParams.checkIn!,
            searchParams.checkOut!
          );
          
          return { property, isAvailable };
        })
      ).then(results => 
        results
          .filter(result => result.isAvailable)
          .map(result => result.property)
      );
    }
    
    return filteredProperties;
  }
  
  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const newProperty: Property = { ...property, id };
    this.propertiesData.set(id, newProperty);
    return newProperty;
  }
  
  // Property images
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    return this.propertyImagesData.get(propertyId) || [];
  }
  
  async addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    const id = this.propertyImageIdCounter++;
    const newImage: PropertyImage = { ...image, id };
    
    if (!this.propertyImagesData.has(image.propertyId)) {
      this.propertyImagesData.set(image.propertyId, []);
    }
    
    this.propertyImagesData.get(image.propertyId)!.push(newImage);
    return newImage;
  }
  
  // Amenities
  async getAmenities(): Promise<Amenity[]> {
    return Array.from(this.amenitiesData.values());
  }
  
  async getPropertyAmenities(propertyId: number): Promise<Amenity[]> {
    const amenityIds = this.propertyAmenitiesData.get(propertyId) || [];
    return amenityIds.map(id => this.amenitiesData.get(id)!);
  }
  
  async addAmenity(amenity: InsertAmenity): Promise<Amenity> {
    const id = this.amenityIdCounter++;
    const newAmenity: Amenity = { ...amenity, id };
    this.amenitiesData.set(id, newAmenity);
    return newAmenity;
  }
  
  async addPropertyAmenity(propertyAmenity: InsertPropertyAmenity): Promise<PropertyAmenity> {
    const id = this.propertyAmenityIdCounter++;
    const newPropertyAmenity: PropertyAmenity = { ...propertyAmenity, id };
    
    if (!this.propertyAmenitiesData.has(propertyAmenity.propertyId)) {
      this.propertyAmenitiesData.set(propertyAmenity.propertyId, []);
    }
    
    this.propertyAmenitiesData.get(propertyAmenity.propertyId)!.push(propertyAmenity.amenityId);
    return newPropertyAmenity;
  }
  
  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const newBooking: Booking = { 
      ...booking, 
      id,
      createdAt: new Date()
    };
    
    this.bookingsData.set(id, newBooking);
    return newBooking;
  }
  
  async getPropertyBookings(propertyId: number): Promise<Booking[]> {
    return Array.from(this.bookingsData.values())
      .filter(booking => booking.propertyId === propertyId);
  }
  
  async checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const bookings = await this.getPropertyBookings(propertyId);
    
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    
    // Check if there's any overlap with existing bookings
    const isOverlapping = bookings.some(booking => {
      const bookingCheckInTime = new Date(booking.checkIn).getTime();
      const bookingCheckOutTime = new Date(booking.checkOut).getTime();
      
      return (
        (checkInTime >= bookingCheckInTime && checkInTime < bookingCheckOutTime) ||
        (checkOutTime > bookingCheckInTime && checkOutTime <= bookingCheckOutTime) ||
        (checkInTime <= bookingCheckInTime && checkOutTime >= bookingCheckOutTime)
      );
    });
    
    return !isOverlapping;
  }
  
  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const newContact: Contact = { 
      ...contact, 
      id,
      createdAt: new Date()
    };
    
    this.contactsData.set(id, newContact);
    return newContact;
  }
  
  // Locations
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locationsData.values());
  }
  
  // Reviews
  async getPropertyReviews(propertyId: number): Promise<Review[]> {
    return this.reviewsData.get(propertyId) || [];
  }
  
  async addReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = { 
      ...review, 
      id,
      date: new Date()
    };
    
    if (!this.reviewsData.has(review.propertyId)) {
      this.reviewsData.set(review.propertyId, []);
    }
    
    this.reviewsData.get(review.propertyId)!.push(newReview);
    
    // Update property review count and rating
    const property = this.propertiesData.get(review.propertyId);
    if (property) {
      const reviews = this.reviewsData.get(review.propertyId)!;
      property.reviewCount = reviews.length;
      
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      property.rating = totalRating / reviews.length;
      
      this.propertiesData.set(review.propertyId, property);
    }
    
    return newReview;
  }
}

export class DatabaseStorage implements IStorage {
  // Property operations
  async getProperties(): Promise<Property[]> {
    return db.select().from(properties);
  }
  
  async getProperty(id: number): Promise<PropertyWithDetails | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    
    if (!property) return undefined;
    
    const images = await this.getPropertyImages(id);
    const amenities = await this.getPropertyAmenities(id);
    const reviews = await this.getPropertyReviews(id);
    
    return {
      ...property,
      images,
      amenities,
      reviews
    };
  }
  
  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    return db.select()
      .from(properties)
      .where(eq(properties.isFeatured, true))
      .limit(limit);
  }
  
  async searchProperties(searchParams: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: number[];
  }): Promise<Property[]> {
    let query = db.select().from(properties);
    const conditions = [];
    
    if (searchParams.location) {
      conditions.push(like(properties.location, `%${searchParams.location}%`));
    }
    
    if (searchParams.minPrice !== undefined) {
      conditions.push(gte(properties.price, searchParams.minPrice.toString()));
    }
    
    if (searchParams.maxPrice !== undefined) {
      conditions.push(lte(properties.price, searchParams.maxPrice.toString()));
    }
    
    if (searchParams.bedrooms !== undefined) {
      conditions.push(gte(properties.bedrooms, searchParams.bedrooms));
    }
    
    if (searchParams.bathrooms !== undefined) {
      conditions.push(gte(properties.bathrooms, searchParams.bathrooms));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    let filteredProperties = await query;
    
    // Handle amenities filter with a separate query
    if (searchParams.amenities && searchParams.amenities.length > 0) {
      const propertyAmenitiesResults = await db.select({
        propertyId: propertyAmenities.propertyId,
        amenityCount: sql<number>`count(${propertyAmenities.amenityId})`
      })
      .from(propertyAmenities)
      .where(inArray(propertyAmenities.amenityId, searchParams.amenities))
      .groupBy(propertyAmenities.propertyId)
      .having(sql`count(${propertyAmenities.amenityId}) = ${searchParams.amenities.length}`);
      
      const propertyIds = propertyAmenitiesResults.map(pa => pa.propertyId);
      filteredProperties = filteredProperties.filter(p => propertyIds.includes(p.id));
    }
    
    // Handle availability with a separate query
    if (searchParams.checkIn && searchParams.checkOut) {
      const unavailablePropertyIds = await db.select({ propertyId: bookings.propertyId })
        .from(bookings)
        .where(
          and(
            // Check if requested dates overlap with any existing booking
            // (checkIn <= existing.checkOut && checkOut >= existing.checkIn)
            lte(bookings.checkIn, searchParams.checkOut),
            gte(bookings.checkOut, searchParams.checkIn)
          )
        )
        .then(results => results.map(r => r.propertyId));
      
      filteredProperties = filteredProperties.filter(p => !unavailablePropertyIds.includes(p.id));
    }
    
    return filteredProperties;
  }
  
  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }
  
  // Property images
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    return db.select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId));
  }
  
  async addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    const [newImage] = await db.insert(propertyImages).values(image).returning();
    return newImage;
  }
  
  // Amenities
  async getAmenities(): Promise<Amenity[]> {
    return db.select().from(amenities);
  }
  
  async getPropertyAmenities(propertyId: number): Promise<Amenity[]> {
    const result = await db.select({
      amenity: amenities
    })
    .from(propertyAmenities)
    .innerJoin(amenities, eq(propertyAmenities.amenityId, amenities.id))
    .where(eq(propertyAmenities.propertyId, propertyId));
    
    return result.map(r => r.amenity);
  }
  
  async addAmenity(amenity: InsertAmenity): Promise<Amenity> {
    const [newAmenity] = await db.insert(amenities).values(amenity).returning();
    return newAmenity;
  }
  
  async addPropertyAmenity(propertyAmenity: InsertPropertyAmenity): Promise<PropertyAmenity> {
    const [newPropertyAmenity] = await db.insert(propertyAmenities).values(propertyAmenity).returning();
    return newPropertyAmenity;
  }
  
  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }
  
  async getPropertyBookings(propertyId: number): Promise<Booking[]> {
    return db.select()
      .from(bookings)
      .where(eq(bookings.propertyId, propertyId));
  }
  
  async checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const overlappingBookings = await db.select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, propertyId),
          lte(bookings.checkIn, checkOut),
          gte(bookings.checkOut, checkIn)
        )
      );
    
    return overlappingBookings[0].count === 0;
  }
  
  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }
  
  // Locations
  async getLocations(): Promise<Location[]> {
    return db.select().from(locations);
  }
  
  // Reviews
  async getPropertyReviews(propertyId: number): Promise<Review[]> {
    return db.select()
      .from(reviews)
      .where(eq(reviews.propertyId, propertyId))
      .orderBy(desc(reviews.date));
  }
  
  async addReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update the property's review count and average rating
    const allReviews = await this.getPropertyReviews(review.propertyId);
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await db.update(properties)
      .set({
        reviewCount: allReviews.length,
        rating: avgRating.toFixed(1)
      })
      .where(eq(properties.id, review.propertyId));
    
    return newReview;
  }
}

// Use the DatabaseStorage implementation instead of MemStorage
export const storage = new DatabaseStorage();
