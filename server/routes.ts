import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookingSchema, 
  insertContactSchema,
  insertReviewSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/properties", async (req: Request, res: Response) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const properties = await storage.getFeaturedProperties(limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/search", async (req: Request, res: Response) => {
    try {
      const { 
        location, 
        checkIn, 
        checkOut, 
        minPrice, 
        maxPrice, 
        bedrooms, 
        bathrooms, 
        amenities 
      } = req.query;
      
      const searchParams: any = {};
      
      if (location) searchParams.location = location as string;
      if (minPrice) searchParams.minPrice = parseInt(minPrice as string);
      if (maxPrice) searchParams.maxPrice = parseInt(maxPrice as string);
      if (bedrooms) searchParams.bedrooms = parseInt(bedrooms as string);
      if (bathrooms) searchParams.bathrooms = parseInt(bathrooms as string);
      
      if (checkIn && checkOut) {
        searchParams.checkIn = new Date(checkIn as string);
        searchParams.checkOut = new Date(checkOut as string);
      }
      
      if (amenities) {
        searchParams.amenities = (amenities as string)
          .split(',')
          .map(id => parseInt(id));
      }
      
      const properties = await storage.searchProperties(searchParams);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to search properties" });
    }
  });

  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property details" });
    }
  });

  app.get("/api/properties/:id/images", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const images = await storage.getPropertyImages(id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property images" });
    }
  });

  app.get("/api/properties/:id/amenities", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const amenities = await storage.getPropertyAmenities(id);
      res.json(amenities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property amenities" });
    }
  });

  app.get("/api/properties/:id/reviews", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const reviews = await storage.getPropertyReviews(id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property reviews" });
    }
  });

  app.get("/api/amenities", async (_req: Request, res: Response) => {
    try {
      const amenities = await storage.getAmenities();
      res.json(amenities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch amenities" });
    }
  });

  app.get("/api/locations", async (_req: Request, res: Response) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check availability
      const isAvailable = await storage.checkAvailability(
        bookingData.propertyId,
        bookingData.checkIn,
        bookingData.checkOut
      );
      
      if (!isAvailable) {
        return res.status(400).json({ error: "Selected dates are not available" });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.post("/api/properties/:id/reviews", async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.id);
      
      // Ensure the property exists
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        propertyId
      });
      
      const review = await storage.addReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  app.post("/api/properties/:id/check-availability", async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.id);
      
      const schema = z.object({
        checkIn: z.string().transform(date => new Date(date)),
        checkOut: z.string().transform(date => new Date(date))
      });
      
      const { checkIn, checkOut } = schema.parse(req.body);
      
      const isAvailable = await storage.checkAvailability(propertyId, checkIn, checkOut);
      res.json({ available: isAvailable });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: "Failed to check availability" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
