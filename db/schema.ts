import { pgTable, text, serial, timestamp, jsonb, decimal, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Table Declarations
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type", { enum: ["consumer", "producer", "partner"] }).notNull().default("consumer"),

  // Basic Information
  phoneNumber: text("phone_number"),
  profileImage: text("profile_image"),
  preferredLanguage: text("preferred_language").default("en"),
  bio: text("bio"),
  gender: text("gender"),
  occupation: text("occupation"),

  // Demographics
  dateOfBirth: date("date_of_birth"),
  nationality: text("nationality"),
  identificationNumber: text("identification_number"),

  // Location and Preferences
  location: jsonb("location").$type<{
    country: string;
    city: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>(),

  notificationPreferences: jsonb("notification_preferences").$type<{
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    bookingReminders: boolean;
    paymentAlerts: boolean;
  }>(),

  // Travel Preferences
  travelPreferences: jsonb("travel_preferences").$type<{
    preferredDestinations: string[];
    travelFrequency: string;
    typicalTripDuration: string;
    budgetRange: {
      min: number;
      max: number;
      currency: string;
    };
    specialRequirements: string[];
  }>(),

  // Past Interactions
  pastInteractions: jsonb("past_interactions").$type<{
    totalBookings: number;
    completedTrips: number;
    favoriteServices: number[];
    savedSearches: Array<{
      query: string;
      filters: Record<string, unknown>;
      savedAt: string;
    }>;
    recentlyViewed: Array<{
      serviceId: number;
      viewedAt: string;
    }>;
    reviewsSubmitted: number;
    averageRating: number;
  }>(),

  // Payment Information
  paymentMethods: jsonb("payment_methods").$type<Array<{
    id: string;
    type: "credit_card" | "debit_card" | "bank_account";
    lastFourDigits: string;
    expiryDate?: string;
    isDefault: boolean;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  }>>(),

  // Emergency Contact
  emergencyContact: jsonb("emergency_contact").$type<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  }>(),

  // Privacy Settings
  privacySettings: jsonb("privacy_settings").$type<{
    profileVisibility: "public" | "private" | "registered";
    contactInfoVisibility: "public" | "private" | "registered";
    experienceVisibility: "public" | "private" | "registered";
    businessInfoVisibility: "public" | "private" | "registered";
  }>(),

  // Verification and Timestamps
  verificationStatus: text("verification_status", { 
    enum: ["unverified", "pending", "verified", "rejected"] 
  }).default("unverified"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type", { 
    enum: ["license", "insurance", "registration", "tax", "other"] 
  }).notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  storageKey: text("storage_key").notNull(),
  status: text("status", { 
    enum: ["pending", "approved", "rejected"] 
  }).notNull().default("pending"),
  adminNotes: text("admin_notes"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  location: jsonb("location").notNull().$type<{
    lat: number;
    lng: number;
  }>(),
  images: jsonb("images").$type<string[]>(),
  availability: jsonb("availability").$type<string[]>().notNull(),
  specifications: jsonb("specifications").$type<{
    length?: number;
    capacity?: number;
    luxuryRating?: number;
    amenities?: string[];
    crew?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  consumerId: integer("consumer_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled"]
  }).notNull().default("pending"),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "refunded", "failed"]
  }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
  services: many(services),
  bookings: many(bookings),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  provider: one(users, {
    fields: [services.providerId],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  consumer: one(users, {
    fields: [bookings.consumerId],
    references: [users.id],
  }),
}));

// Schema and Types
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type UserProfile = SelectUser;

export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);
export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;

export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);
export type InsertService = typeof services.$inferInsert;
export type SelectService = typeof services.$inferSelect;

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;