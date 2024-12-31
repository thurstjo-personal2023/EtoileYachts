import { pgTable, text, serial, timestamp, jsonb, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Users table with enhanced profile fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  businessName: text("business_name"),
  phoneNumber: text("phone_number"),
  profileImage: text("profile_image"),
  userType: text("user_type", {
    enum: ["consumer", "producer", "partner", "admin"]
  }).notNull().default("consumer"),

  // Basic Information
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  nationality: text("nationality"),
  preferredLanguage: text("preferred_language"),
  preferredCurrency: text("preferred_currency"),

  // Notification Settings
  notificationPreferences: jsonb("notification_preferences").$type<{
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
    categories: {
      booking: boolean;
      payment: boolean;
      maintenance: boolean;
      weather: boolean;
      system: boolean;
      marketing: boolean;
    };
    frequency: "instant" | "daily" | "weekly";
    quiet_hours: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    };
  }>(),

  // Consumer Specific Fields
  consumerProfile: jsonb("consumer_profile").$type<{
    activityPreferences: string[];
    dietaryRestrictions: string[];
    accessibilityNeeds: string[];
    favoriteDestinations: string[];
    loyaltyProgram: {
      tier: "bronze" | "silver" | "gold" | "platinum";
      points: number;
      rewardsHistory: Array<{
        date: string;
        description: string;
        points: number;
      }>;
    };
    bookingHistory: Array<{
      bookingId: number;
      date: string;
      serviceType: string;
      status: string;
    }>;
    paymentMethods: Array<{
      type: string;
      lastFour: string;
      expiryDate: string;
      isDefault: boolean;
    }>;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  }>(),

  // Producer Specific Fields
  producerProfile: jsonb("producer_profile").$type<{
    role: "yacht_owner" | "captain" | "facilitator";
    certifications: Array<{
      type: string;
      name: string;
      issuingAuthority: string;
      issueDate: string;
      expiryDate: string;
      documentUrl: string;
      verificationStatus: "pending" | "verified" | "expired";
    }>;
    yearsOfExperience: number;
    languages: Array<{
      language: string;
      proficiency: "basic" | "intermediate" | "fluent" | "native";
    }>;
    yachtDetails: Array<{
      name: string;
      modelAndYear: string;
      capacity: number;
      features: {
        interior: string[];
        entertainment: string[];
        outdoor: string[];
        waterToys: string[];
      };
      technicalSpecs: {
        length: number;
        beam: number;
        enginePower: string;
        cruisingSpeed: number;
        range: number;
      };
      safety: {
        features: string[];
        certifications: string[];
      };
      crew: Array<{
        role: string;
        expertise: string[];
        services: string[];
      }>;
    }>;
    activities: Array<{
      type: string;
      description: string;
      equipment: string[];
      safetyMeasures: string[];
    }>;
  }>(),

  // Partner Specific Fields
  partnerProfile: jsonb("partner_profile").$type<{
    role: "chef" | "equipment_provider" | "music_group" | "restaurant" | "caterer";
    specialties: string[];
    certifications: Array<{
      type: string;
      name: string;
      issuingAuthority: string;
      issueDate: string;
      expiryDate: string;
      documentUrl: string;
      verificationStatus: "pending" | "verified" | "expired";
    }>;
    services: Array<{
      name: string;
      description: string;
      pricing: {
        rate: number;
        unit: "hour" | "day" | "event";
      };
      availability: boolean;
    }>;
    equipment: Array<{
      name: string;
      description: string;
      quantity: number;
      specifications: Record<string, string>;
    }>;
    menuOptions: Array<{
      name: string;
      description: string;
      price: number;
      dietaryInfo: string[];
      minimumGuests: number;
    }>;
  }>(),

  // Availability and Pricing
  availability: jsonb("availability").$type<{
    schedule: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
    seasonalAvailability: {
      summer: boolean;
      winter: boolean;
      spring: boolean;
      fall: boolean;
    };
    pricing: {
      baseRate: number;
      unit: "hour" | "day" | "event";
      seasonalRates: Array<{
        season: string;
        rate: number;
        startDate: string;
        endDate: string;
      }>;
    };
    cancellationPolicy: {
      type: "flexible" | "moderate" | "strict";
      description: string;
      refundPolicy: string;
    };
  }>(),

  // Media Gallery
  mediaGallery: jsonb("media_gallery").$type<{
    photos: Array<{
      url: string;
      caption: string;
      type: "profile" | "yacht_exterior" | "yacht_interior" | "activity" | "service";
      isFeatured: boolean;
    }>;
    videos: Array<{
      url: string;
      title: string;
      description: string;
      thumbnail: string;
    }>;
  }>(),


  privacySettings: jsonb("privacy_settings").$type<{
    profileVisibility: "public" | "private" | "registered" | "verified";
    contactInfoVisibility: "public" | "private" | "registered" | "verified";
    galleryVisibility: "public" | "private" | "registered" | "verified";
    reviewsVisibility: "public" | "private" | "registered" | "verified";
  }>(),

  emergencyContact: jsonb("emergency_contact").$type<{
    name: string;
    phoneNumber: string;
    email: string;
    relationship: string;
  }>(),

  verificationStatus: text("verification_status", {
    enum: ["unverified", "pending", "verified", "rejected", "suspended"]
  }).default("unverified"),

  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type", {
    enum: ["booking", "message", "system", "payment", "maintenance", "weather"]
  }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  category: text("category").notNull(),
  priority: text("priority", {
    enum: ["low", "medium", "high", "urgent"]
  }).default("medium"),
  read: boolean("read").default(false),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata").$type<{
    bookingId?: number;
    messageId?: number;
    amount?: number;
    location?: string;
    [key: string]: any;
  }>(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  targetId: integer("target_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  images: jsonb("images").$type<string[]>(),
  status: text("status", {
    enum: ["pending", "published", "flagged", "removed"]
  }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  consumerId: integer("consumer_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  serviceType: text("service_type").notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled"]
  }).default("pending"),
  guestCount: integer("guest_count"),
  specialRequests: text("special_requests"),
  totalAmount: decimal("total_amount"),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "refunded", "failed"]
  }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  notifications: many(notifications),
  bookings: many(bookings),
  reviews: many(reviews)
}));

// Create schemas for notifications
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);
export type InsertNotification = typeof notifications.$inferInsert;
export type SelectNotification = typeof notifications.$inferSelect;

// Schema exports
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = typeof reviews.$inferInsert;
export type SelectReview = typeof reviews.$inferSelect;

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;