import { pgTable, text, serial, integer, boolean, date, timestamp, varchar, numeric, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Property schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  price: text("price").notNull(),  // Stored as text for compatibility with Supabase
  rating: text("rating"),          // Stored as text for compatibility with Supabase
  reviewCount: integer("review_count").default(0),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  mainImage: text("main_image").notNull(),
  isFeatured: boolean("is_featured").default(false),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  reviewCount: true,
});

// Property images schema
export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertPropertyImageSchema = createInsertSchema(propertyImages).omit({
  id: true,
});

// Amenities schema
export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

export const insertAmenitySchema = createInsertSchema(amenities).omit({
  id: true,
});

// Property amenities relation schema
export const propertyAmenities = pgTable("property_amenities", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  amenityId: integer("amenity_id").notNull(),
});

export const insertPropertyAmenitySchema = createInsertSchema(propertyAmenities).omit({
  id: true,
});

// Bookings schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  totalPrice: numeric("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// Contact schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  propertyId: integer("property_id"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

// Location schema for filtering
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // city, state, country, etc.
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

// Reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  guestName: text("guest_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: timestamp("date").defaultNow(),
  avatar: text("avatar").default("/avatars/default.png"),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  date: true,
});

// Type definitions
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = z.infer<typeof insertPropertyImageSchema>;

export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = z.infer<typeof insertAmenitySchema>;

export type PropertyAmenity = typeof propertyAmenities.$inferSelect;
export type InsertPropertyAmenity = z.infer<typeof insertPropertyAmenitySchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Define relations between tables
export const propertiesRelations = relations(properties, ({ many }) => ({
  images: many(propertyImages),
  amenities: many(propertyAmenities),
  bookings: many(bookings),
  reviews: many(reviews),
  contacts: many(contacts),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  properties: many(propertyAmenities),
}));

export const propertyAmenitiesRelations = relations(propertyAmenities, ({ one }) => ({
  property: one(properties, {
    fields: [propertyAmenities.propertyId],
    references: [properties.id],
  }),
  amenity: one(amenities, {
    fields: [propertyAmenities.amenityId],
    references: [amenities.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  property: one(properties, {
    fields: [bookings.propertyId],
    references: [properties.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  property: one(properties, {
    fields: [contacts.propertyId],
    references: [properties.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id],
  }),
}));

// Extended types for API responses
export type PropertyWithDetails = Property & {
  images: PropertyImage[];
  amenities: Amenity[];
  reviews: Review[];
};
