import { pgTable, text, serial, timestamp, jsonb, decimal, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Table Declarations
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  fullName: text("fullName").notNull(),
  userType: text("userType", { enum: ["consumer", "producer", "partner"] }).notNull().default("consumer"),

  // Basic Information
  phoneNumber: text("phoneNumber"),
  profileImage: text("profileImage"),
  preferredLanguage: text("preferredLanguage").default("en"),
  bio: text("bio"),
  gender: text("gender"),
  occupation: text("occupation"),

  // Demographics
  dateOfBirth: date("dateOfBirth"),
  nationality: text("nationality"),
  identificationNumber: text("identificationNumber"),

  // Location and Preferences
  location: jsonb("location").$type<{
    country: string;
    city: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>().default({}),

  notificationPreferences: jsonb("notificationPreferences").$type<{
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    bookingReminders: boolean;
    paymentAlerts: boolean;
    specialOffers: boolean;
    newsletterSubscription: boolean;
  }>().default({
    email: true,
    sms: false,
    pushNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    paymentAlerts: true,
    specialOffers: false,
    newsletterSubscription: false
  }),

  // Travel and Experience Preferences
  travelPreferences: jsonb("travelPreferences").$type<{
    preferredDestinations: string[];
    travelFrequency: string;
    typicalTripDuration: string;
    budgetRange: {
      min: number;
      max: number;
      currency: string;
    };
    specialRequirements: string[];
    accommodationPreferences: string[];
    activityInterests: string[];
    dietaryRestrictions: string[];
  }>().default({
    preferredDestinations: [],
    travelFrequency: "",
    typicalTripDuration: "",
    budgetRange: { min: 0, max: 0, currency: "USD" },
    specialRequirements: [],
    accommodationPreferences: [],
    activityInterests: [],
    dietaryRestrictions: []
  }),

  // Loyalty Program
  loyaltyProgram: jsonb("loyaltyProgram").$type<{
    memberId: string;
    tier: string;
    pointsBalance: number;
    joinDate: string;
    lifetimePoints: number;
    benefits: string[];
    tierExpiryDate: string;
    referralCode: string;
  }>().default({
    memberId: "",
    tier: "Bronze",
    pointsBalance: 0,
    joinDate: new Date().toISOString(),
    lifetimePoints: 0,
    benefits: [],
    tierExpiryDate: "",
    referralCode: ""
  }),

  // Past Interactions
  pastInteractions: jsonb("pastInteractions").$type<{
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
  }>().default({
    totalBookings: 0,
    completedTrips: 0,
    favoriteServices: [],
    savedSearches: [],
    recentlyViewed: [],
    reviewsSubmitted: 0,
    averageRating: 0
  }),

  // Payment Information
  paymentMethods: jsonb("paymentMethods").$type<Array<{
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
  }>>().default([]),

  // Emergency Contact
  emergencyContact: jsonb("emergencyContact").$type<{
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
    alternateContact?: {
      name: string;
      phone: string;
    };
  }>().default({}),

  // Privacy Settings
  privacySettings: jsonb("privacySettings").$type<{
    profileVisibility: "public" | "private" | "registered";
    contactInfoVisibility: "public" | "private" | "registered";
    experienceVisibility: "public" | "private" | "registered";
    businessInfoVisibility: "public" | "private" | "registered";
  }>().default({
    profileVisibility: "registered",
    contactInfoVisibility: "private",
    experienceVisibility: "registered",
    businessInfoVisibility: "registered"
  }),

  // Verification and Timestamps
  verificationStatus: text("verificationStatus", { 
    enum: ["unverified", "pending", "verified", "rejected"] 
  }).default("unverified"),

  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id).notNull(),
  type: text("type", { 
    enum: ["license", "insurance", "registration", "tax", "other"] 
  }).notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mimeType").notNull(),
  fileSize: integer("fileSize").notNull(),
  storageKey: text("storageKey").notNull(),
  status: text("status", { 
    enum: ["pending", "approved", "rejected"] 
  }).notNull().default("pending"),
  adminNotes: text("adminNotes"),
  expiryDate: timestamp("expiryDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("providerId").references(() => users.id).notNull(),
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
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  serviceId: integer("serviceId").references(() => services.id).notNull(),
  consumerId: integer("consumerId").references(() => users.id).notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled"]
  }).notNull().default("pending"),
  paymentStatus: text("paymentStatus", {
    enum: ["pending", "paid", "refunded", "failed"]
  }).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
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