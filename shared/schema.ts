import { pgTable, text, serial, integer, boolean, json, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: date("created_at").defaultNow().notNull(),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  price: numeric("price").notNull(),
  rating: numeric("rating"),
  reviewCount: integer("review_count").default(0),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  imageUrls: json("image_urls").$type<string[]>().notNull().default([]),
  amenities: json("amenities").$type<string[]>().notNull().default([]),
  hostId: integer("host_id").notNull(),
  isNew: boolean("is_new").default(false),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  createdAt: date("created_at").defaultNow().notNull(),
  type: text("type").notNull().default("apartment"),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  userId: integer("user_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalPrice: numeric("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  customizations: json("customizations").$type<{ id: string; name: string; price: number }[]>().default([]),
  createdAt: date("created_at").defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
});

// Customization options table
export const customizationOptions = pgTable("customization_options", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  icon: text("icon").notNull(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  propertyId: integer("property_id").notNull(),
  content: text("content").notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false),
});

// Locations/Destinations table
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  propertyCount: integer("property_count").default(0),
});

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Schema for inserting properties
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

// Schema for inserting bookings
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// Schema for inserting reviews
export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Schema for inserting customization options
export const insertCustomizationOptionSchema = createInsertSchema(customizationOptions).omit({
  id: true,
});

// Schema for inserting messages
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Schema for inserting destinations
export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

// Types for insertion and selection
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertCustomizationOption = z.infer<typeof insertCustomizationOptionSchema>;
export type CustomizationOption = typeof customizationOptions.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;
