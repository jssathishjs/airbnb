import {
  users, properties, bookings, reviews, customizationOptions, messages, destinations,
  type User, type Property, type Booking, type Review, type CustomizationOption, type Message, type Destination,
  type InsertUser, type InsertProperty, type InsertBooking, type InsertReview, type InsertCustomizationOption, type InsertMessage, type InsertDestination
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property operations
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByHostId(hostId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  searchProperties(query: {
    location?: string;
    startDate?: Date;
    endDate?: Date;
    guests?: number;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    type?: string;
  }): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getRecentProperties(limit?: number): Promise<Property[]>;

  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByPropertyId(propertyId: number): Promise<Booking[]>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;

  // Review operations
  getReviewsByPropertyId(propertyId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Customization options operations
  getCustomizationOptionsByPropertyId(propertyId: number): Promise<CustomizationOption[]>;
  createCustomizationOption(option: InsertCustomizationOption): Promise<CustomizationOption>;

  // Message operations
  getMessagesBetweenUsers(userId1: number, userId2: number, propertyId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;

  // Destination operations
  getAllDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  getFeaturedDestinations(limit?: number): Promise<Destination[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private customizationOptions: Map<number, CustomizationOption>;
  private messages: Map<number, Message>;
  private destinations: Map<number, Destination>;
  
  private currentUserId: number;
  private currentPropertyId: number;
  private currentBookingId: number;
  private currentReviewId: number;
  private currentCustomizationOptionId: number;
  private currentMessageId: number;
  private currentDestinationId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.customizationOptions = new Map();
    this.messages = new Map();
    this.destinations = new Map();
    
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    this.currentCustomizationOptionId = 1;
    this.currentMessageId = 1;
    this.currentDestinationId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByHostId(hostId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.hostId === hostId,
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = { ...insertProperty, id, createdAt: new Date() };
    this.properties.set(id, property);
    return property;
  }

  async searchProperties(query: {
    location?: string;
    startDate?: Date;
    endDate?: Date;
    guests?: number;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    type?: string;
  }): Promise<Property[]> {
    let filteredProperties = Array.from(this.properties.values());

    if (query.location) {
      filteredProperties = filteredProperties.filter(property => 
        property.location.toLowerCase().includes(query.location!.toLowerCase())
      );
    }

    if (query.guests) {
      filteredProperties = filteredProperties.filter(property => 
        property.maxGuests >= query.guests!
      );
    }

    if (query.minPrice) {
      filteredProperties = filteredProperties.filter(property => 
        Number(property.price) >= query.minPrice!
      );
    }

    if (query.maxPrice) {
      filteredProperties = filteredProperties.filter(property => 
        Number(property.price) <= query.maxPrice!
      );
    }

    if (query.amenities && query.amenities.length > 0) {
      filteredProperties = filteredProperties.filter(property => 
        query.amenities!.every(amenity => 
          (property.amenities as string[]).includes(amenity)
        )
      );
    }

    if (query.type) {
      filteredProperties = filteredProperties.filter(property => 
        property.type === query.type
      );
    }

    // Handle date filtering - check if property is available for the requested dates
    if (query.startDate && query.endDate) {
      const bookedProperties = this.getBookedPropertyIds(query.startDate, query.endDate);
      filteredProperties = filteredProperties.filter(property => 
        !bookedProperties.includes(property.id)
      );
    }

    return filteredProperties;
  }

  private getBookedPropertyIds(startDate: Date, endDate: Date): number[] {
    const bookings = Array.from(this.bookings.values()).filter(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return (
        (startDate >= bookingStart && startDate <= bookingEnd) ||
        (endDate >= bookingStart && endDate <= bookingEnd) ||
        (startDate <= bookingStart && endDate >= bookingEnd)
      );
    });
    
    return bookings.map(booking => booking.propertyId);
  }

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    const allProperties = Array.from(this.properties.values());
    
    // Sort by rating (highest first) and take the specified limit
    return allProperties
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, limit);
  }

  async getRecentProperties(limit: number = 3): Promise<Property[]> {
    const allProperties = Array.from(this.properties.values());
    
    // Filter for newer properties and sort by creation date
    return allProperties
      .filter(property => property.isNew)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByPropertyId(propertyId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.propertyId === propertyId,
    );
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId,
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { ...insertBooking, id, createdAt: new Date() };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    
    if (booking) {
      const updatedBooking: Booking = { ...booking, status };
      this.bookings.set(id, updatedBooking);
      return updatedBooking;
    }
    
    return undefined;
  }

  // Review operations
  async getReviewsByPropertyId(propertyId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.propertyId === propertyId,
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    
    // Update property review count
    const property = this.properties.get(review.propertyId);
    if (property) {
      const updatedProperty: Property = { 
        ...property, 
        reviewCount: (property.reviewCount || 0) + 1,
        rating: this.calculatePropertyRating(review.propertyId)
      };
      this.properties.set(property.id, updatedProperty);
    }
    
    return review;
  }

  private calculatePropertyRating(propertyId: number): number {
    const propertyReviews = Array.from(this.reviews.values()).filter(
      (review) => review.propertyId === propertyId,
    );
    
    if (propertyReviews.length === 0) return 0;
    
    const totalRating = propertyReviews.reduce(
      (sum, review) => sum + review.rating, 
      0
    );
    
    return +(totalRating / propertyReviews.length).toFixed(2);
  }

  // Customization options operations
  async getCustomizationOptionsByPropertyId(propertyId: number): Promise<CustomizationOption[]> {
    return Array.from(this.customizationOptions.values()).filter(
      (option) => option.propertyId === propertyId,
    );
  }

  async createCustomizationOption(insertOption: InsertCustomizationOption): Promise<CustomizationOption> {
    const id = this.currentCustomizationOptionId++;
    const option: CustomizationOption = { ...insertOption, id };
    this.customizationOptions.set(id, option);
    return option;
  }

  // Message operations
  async getMessagesBetweenUsers(userId1: number, userId2: number, propertyId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => 
        ((message.senderId === userId1 && message.receiverId === userId2) || 
         (message.senderId === userId2 && message.receiverId === userId1)) &&
        message.propertyId === propertyId
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      isRead: false 
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    
    if (message) {
      const updatedMessage: Message = { ...message, isRead: true };
      this.messages.set(id, updatedMessage);
      return updatedMessage;
    }
    
    return undefined;
  }

  // Destination operations
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.currentDestinationId++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }

  async getFeaturedDestinations(limit: number = 4): Promise<Destination[]> {
    const allDestinations = Array.from(this.destinations.values());
    
    // Sort by property count (most properties first) and take the specified limit
    return allDestinations
      .sort((a, b) => b.propertyCount - a.propertyCount)
      .slice(0, limit);
  }

  // Initialize sample data for the application
  private initializeSampleData() {
    // Create sample users
    const hostUser: InsertUser = {
      username: "host_user",
      password: "password123",
      email: "host@example.com",
      fullName: "Host User",
      avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    };
    this.createUser(hostUser);

    // Create sample destinations
    const destinations: InsertDestination[] = [
      {
        name: "New York",
        imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        propertyCount: 126
      },
      {
        name: "Miami",
        imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        propertyCount: 98
      },
      {
        name: "Los Angeles",
        imageUrl: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        propertyCount: 115
      },
      {
        name: "Aspen",
        imageUrl: "https://images.unsplash.com/photo-1525095182007-b1626e5a0bca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        propertyCount: 67
      }
    ];
    
    destinations.forEach(destination => this.createDestination(destination));

    // Create sample properties
    const properties: InsertProperty[] = [
      {
        title: "Modern Beachfront Villa",
        description: "Enjoy this stunning beachfront villa with panoramic ocean views. This luxurious 4-bedroom property features modern architecture, high-end finishes, and direct beach access. The spacious living area opens to a private terrace with an infinity pool overlooking the Atlantic Ocean.",
        location: "Miami Beach, Florida",
        price: "349",
        rating: "4.92",
        reviewCount: 127,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        imageUrls: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Pool", "Ocean view", "Beachfront", "Wifi", "Air conditioning"],
        hostId: 1,
        isNew: false,
        latitude: "25.7907",
        longitude: "-80.1300",
        type: "villa"
      },
      {
        title: "Luxury Apartment Downtown",
        description: "Experience luxury in the heart of New York City with this stunning apartment featuring floor-to-ceiling windows with breathtaking city views. This modern 2-bedroom unit has high-end finishes throughout and access to building amenities including a gym and rooftop terrace.",
        location: "New York, NY",
        price: "289",
        rating: "4.87",
        reviewCount: 94,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        imageUrls: [
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Gym", "City view", "Wifi", "Air conditioning"],
        hostId: 1,
        isNew: false,
        latitude: "40.7128",
        longitude: "-74.0060",
        type: "apartment"
      },
      {
        title: "Cozy Mountain Cabin",
        description: "Get away from it all in this charming mountain cabin. Nestled among the trees with stunning mountain views, this 3-bedroom cabin features rustic decor with modern amenities. Relax in the hot tub or curl up by the fireplace after a day of skiing or hiking.",
        location: "Aspen, Colorado",
        price: "259",
        rating: "4.95",
        reviewCount: 86,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        imageUrls: [
          "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Fireplace", "Hot tub", "Mountain view", "Wifi"],
        hostId: 1,
        isNew: false,
        latitude: "39.1911",
        longitude: "-106.8175",
        type: "cabin"
      },
      {
        title: "Modern Suburban Home",
        description: "Spacious and modern home in a quiet suburban neighborhood. Perfect for families, this 4-bedroom house has a large backyard with BBQ and outdoor dining area. Close to parks, shopping, and restaurants.",
        location: "San Diego, California",
        price: "199",
        rating: "4.9",
        reviewCount: 12,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        imageUrls: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Garden", "BBQ", "Wifi", "Free parking"],
        hostId: 1,
        isNew: true,
        latitude: "32.7157",
        longitude: "-117.1611",
        type: "house"
      },
      {
        title: "Beachside Bungalow",
        description: "Charming beachside bungalow just steps from the sand. This cozy 2-bedroom cottage has been recently renovated with a light, airy interior and a private patio for outdoor dining. Walk to local restaurants and shops.",
        location: "Santa Monica, California",
        price: "239",
        rating: "4.88",
        reviewCount: 18,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        imageUrls: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Beach access", "Patio", "Wifi", "Air conditioning"],
        hostId: 1,
        isNew: true,
        latitude: "34.0195",
        longitude: "-118.4912",
        type: "bungalow"
      },
      {
        title: "Downtown Loft",
        description: "Stylish loft in a converted historic building in the heart of Chicago. This modern 1-bedroom space features high ceilings, exposed brick, and large windows with views of the city skyline. Walk to shopping, dining, and cultural attractions.",
        location: "Chicago, Illinois",
        price: "179",
        rating: "4.82",
        reviewCount: 15,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        imageUrls: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Skyline view", "Gym access", "Wifi", "Modern kitchen"],
        hostId: 1,
        isNew: true,
        latitude: "41.8781",
        longitude: "-87.6298",
        type: "loft"
      }
    ];
    
    properties.forEach(property => this.createProperty(property));

    // Create sample customization options
    const customizationOptions: InsertCustomizationOption[] = [
      {
        propertyId: 1,
        name: "Welcome Package",
        description: "Champagne, fruits, and local treats",
        price: "49",
        icon: "concierge-bell"
      },
      {
        propertyId: 1,
        name: "Airport Transfer",
        description: "Private pickup and drop-off",
        price: "79",
        icon: "car"
      },
      {
        propertyId: 1,
        name: "Private Chef",
        description: "Custom menu for one dinner",
        price: "199",
        icon: "utensils"
      }
    ];
    
    customizationOptions.forEach(option => this.createCustomizationOption(option));
  }
}

export const storage = new MemStorage();
