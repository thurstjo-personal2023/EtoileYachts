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

  // Firebase Cloud Messaging token for notifications
  fcmToken: text("fcm_token"),
  fcmTokenLastUpdated: timestamp("fcm_token_last_updated"),

  // Basic Information
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  nationality: text("nationality"),
  preferredLanguage: text("preferred_language"),
  preferredCurrency: text("preferred_currency"),
  bio: text("bio"),

  // Producer Profile
  producerProfile: jsonb("producer_profile").$type<{
    role: "yacht_owner" | "captain" | "crew" | "manager";
    experience: {
      yearsOfExperience: number;
      qualifications: Array<{
        type: string;
        name: string;
        issuingAuthority: string;
        issueDate: string;
        expiryDate: string;
        documentUrl: string;
        verificationStatus: "pending" | "verified" | "expired";
      }>;
      specialties: string[];
      languages: Array<{
        language: string;
        proficiency: "basic" | "intermediate" | "fluent" | "native";
      }>;
    };
    vessels: Array<{
      name: string;
      type: string;
      manufacturer: string;
      model: string;
      year: number;
      registration: {
        number: string;
        country: string;
        port: string;
      };
      specifications: {
        length: number;
        beam: number;
        draft: number;
        grossTonnage: number;
        engineHours: number;
        fuelCapacity: number;
        waterCapacity: number;
        maxSpeed: number;
        cruisingSpeed: number;
        range: number;
      };
      capacity: {
        guests: {
          day: number;
          overnight: number;
        };
        cabins: {
          guest: number;
          crew: number;
        };
        crew: {
          minimum: number;
          maximum: number;
        };
      };
      features: {
        navigation: string[];
        safety: string[];
        entertainment: string[];
        waterSports: string[];
        amenities: string[];
      };
      media: {
        images: Array<{
          url: string;
          type: "exterior" | "interior" | "aerial" | "detail";
          isFeatured: boolean;
          caption: string;
        }>;
        videos: Array<{
          url: string;
          thumbnail: string;
          title: string;
          description: string;
        }>;
        virtualTours: Array<{
          url: string;
          title: string;
          description: string;
        }>;
      };
      documents: Array<{
        type: string;
        number: string;
        issueDate: string;
        expiryDate: string;
        documentUrl: string;
        verificationStatus: "pending" | "verified" | "expired";
      }>;
      maintenance: Array<{
        type: string;
        date: string;
        description: string;
        provider: string;
        cost: number;
        nextDueDate: string;
        documents: Array<{
          type: string;
          url: string;
          description: string;
        }>;
      }>;
    }>;
    certifications: Array<{
      type: string;
      name: string;
      issuingAuthority: string;
      issueDate: string;
      expiryDate: string;
      documentUrl: string;
      verificationStatus: "pending" | "verified" | "expired";
    }>;
    availability: {
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
    };
  }>(),

  // Contact Information
  address: jsonb("address").$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>(),

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

  // Privacy Settings
  privacySettings: jsonb("privacy_settings").$type<{
    profileVisibility: "public" | "private" | "registered" | "verified";
    contactVisibility: "public" | "private" | "registered" | "verified";
    servicesVisibility: "public" | "private" | "registered" | "verified";
    portfolioVisibility: "public" | "private" | "registered" | "verified";
    reviewsVisibility: "public" | "private" | "registered" | "verified";
  }>(),

  // Emergency Contact
  emergencyContact: jsonb("emergency_contact").$type<{
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  }>(),

  verificationStatus: text("verification_status", {
    enum: ["unverified", "pending", "verified", "rejected", "suspended"]
  }).default("unverified"),

  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create schemas for users
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  notifications: many(notifications),
  bookings: many(bookings),
  reviews: many(reviews),
  activities: many(activities)
}));

// Notifications table enhanced for Firebase Cloud Messaging
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

  // Enhanced metadata for FCM
  fcmMessageId: text("fcm_message_id"),
  fcmStatus: text("fcm_status", {
    enum: ["pending", "sent", "delivered", "failed"]
  }).default("pending"),
  fcmError: text("fcm_error"),

  metadata: jsonb("metadata").$type<{
    bookingId?: number;
    messageId?: number;
    amount?: number;
    location?: string;
    // FCM specific fields
    imageUrl?: string;
    icon?: string;
    badge?: string;
    color?: string;
    sound?: string;
    clickAction?: string;
    tag?: string;
    [key: string]: any;
  }>(),

  scheduledFor: timestamp("scheduled_for"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at")
});

// Create schemas for notifications
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);
export type InsertNotification = typeof notifications.$inferInsert;
export type SelectNotification = typeof notifications.$inferSelect;

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

// Create schemas for reviews
export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = typeof reviews.$inferInsert;
export type SelectReview = typeof reviews.$inferSelect;

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
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "refunded", "failed"]
  }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create schemas for bookings
export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;

// Activities table for yacht-related activities
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type", {
    enum: ["water_sports", "sailing", "fishing", "special_events", "diving"]
  }).notNull(),
  equipment: jsonb("equipment").$type<string[]>(),
  safetyMeasures: jsonb("safety_measures").$type<string[]>(),
  pricing: jsonb("pricing").$type<{
    rate: number;
    unit: "hour" | "day" | "event";
    minimumDuration?: number;
    maximumDuration?: number;
    groupSize?: {
      min: number;
      max: number;
    };
  }>(),
  status: text("status", {
    enum: ["active", "inactive", "maintenance"]
  }).default("active"),
  location: jsonb("location").$type<{
    latitude: number;
    longitude: number;
    name: string;
    address?: string;
  }>(),
  media: jsonb("media").$type<{
    images: string[];
    videos?: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create schemas for activities
export const insertActivitySchema = createInsertSchema(activities);
export const selectActivitySchema = createSelectSchema(activities);
export type InsertActivity = typeof activities.$inferInsert;
export type SelectActivity = typeof activities.$inferSelect;

// Add relations for activities
export const activitiesRelations = relations(activities, ({ one }) => ({
  provider: one(users, {
    fields: [activities.providerId],
    references: [users.id],
  }),
}));