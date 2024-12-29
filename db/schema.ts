import { pgTable, text, serial, timestamp, jsonb, decimal, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// User table with enhanced fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type", { enum: ["consumer", "producer", "partner"] }).notNull().default("consumer"),
  role: text("role", {
    enum: ["yacht_owner", "captain", "facilitator", "crew_member", "instructor"]
  }),
  phoneNumber: text("phone_number"),
  profileImage: text("profile_image"),
  preferredLanguage: text("preferred_language").default("en"),
  bio: text("bio"),
  gender: text("gender"),
  occupation: text("occupation"),
  dateOfBirth: date("date_of_birth"),
  nationality: text("nationality"),
  identificationNumber: text("identification_number"),
  location: jsonb("location").$type<{
    country: string;
    city: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>(),
  professionalInfo: jsonb("professional_info").$type<{
    yearsOfExperience: number;
    languages: string[];
    certifications: Array<{
      type: string;
      name: string;
      issuer: string;
      issueDate: string;
      expiryDate?: string;
      licenseNumber?: string;
      verificationStatus: "pending" | "verified" | "expired";
      documents?: string[];
    }>;
    availability: {
      timezone: string;
      workingHours: Array<{
        day: string;
        start: string;
        end: string;
      }>;
      vacationDates: string[];
    };
  }>().default({
    yearsOfExperience: 0,
    languages: ["English"],
    certifications: [],
    availability: {
      timezone: "UTC",
      workingHours: [],
      vacationDates: []
    }
  }),
  notificationPreferences: jsonb("notification_preferences").$type<{
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    bookingReminders: boolean;
    paymentAlerts: boolean;
    maintenanceAlerts: boolean;
    complianceReminders: boolean;
  }>().default({
    email: true,
    sms: false,
    pushNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    paymentAlerts: true,
    maintenanceAlerts: true,
    complianceReminders: true
  }),
  privacySettings: jsonb("privacy_settings").$type<{
    profileVisibility: "public" | "private" | "registered";
    contactInfoVisibility: "public" | "private" | "registered";
    experienceVisibility: "public" | "private" | "registered";
    businessInfoVisibility: "public" | "private" | "registered";
    reviewsVisibility: "public" | "private" | "registered";
  }>().default({
    profileVisibility: "registered",
    contactInfoVisibility: "private",
    experienceVisibility: "registered",
    businessInfoVisibility: "registered",
    reviewsVisibility: "public"
  }),
  verificationStatus: text("verification_status", {
    enum: ["unverified", "pending", "verified", "rejected"]
  }).default("unverified"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vessels table for yacht management
export const vessels = pgTable("vessels", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  length: decimal("length", { precision: 5, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  features: jsonb("features").$type<{
    hasSpa: boolean;
    hasDiningArea: boolean;
    hasChildFriendlyAmenities: boolean;
    additionalFeatures: string[];
  }>().notNull().default({
    hasSpa: false,
    hasDiningArea: false,
    hasChildFriendlyAmenities: false,
    additionalFeatures: []
  }),
  specifications: jsonb("specifications").$type<{
    manufacturer: string;
    engineType: string;
    enginePower: string;
    fuelCapacity: number;
    waterCapacity: number;
    navigation: string[];
    safetyEquipment: string[];
  }>().notNull(),
  availability: jsonb("availability").$type<{
    regularSchedule: Array<{
      dayOfWeek: string;
      timeSlots: Array<{
        start: string;
        end: string;
        maxCapacity: number;
      }>;
    }>;
    blackoutDates: string[];
    specialEvents: Array<{
      date: string;
      name: string;
      description: string;
    }>;
  }>().notNull().default({
    regularSchedule: [],
    blackoutDates: [],
    specialEvents: []
  }),
  media: jsonb("media").$type<{
    images: string[];
    videos?: string[];
    documents?: string[];
  }>().default({
    images: []
  }),
  status: text("status", {
    enum: ["available", "maintenance", "booked", "inactive"]
  }).notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activities and services offered
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  vesselId: integer("vessel_id").references(() => vessels.id).notNull(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  activityTypes: jsonb("activity_types").$type<Array<{
    name: string;
    isOffered: boolean;
    description?: string;
    minimumAge?: number;
    difficulty: "beginner" | "intermediate" | "advanced";
  }>>().notNull().default([]),
  equipment: jsonb("equipment").$type<Array<{
    name: string;
    description: string;
    quantity: number;
    condition: "new" | "good" | "fair";
    maintenanceSchedule?: {
      lastMaintenance: string;
      nextMaintenance: string;
    };
  }>>().notNull().default([]),
  safetyMeasures: jsonb("safety_measures").$type<Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    requiredCertifications?: string[];
    equipmentRequired?: string[];
  }>>().notNull().default([]),
  instructions: jsonb("instructions").$type<Array<{
    step: number;
    title: string;
    description: string;
    imageUrl?: string;
    duration?: number;
  }>>().notNull().default([]),
  pricing: jsonb("pricing").$type<{
    baseRate: number;
    currency: string;
    unit: "hour" | "day" | "week";
    minimumDuration: number;
    maximumDuration?: number;
    securityDeposit?: number;
  }>().notNull(),
  status: text("status", {
    enum: ["active", "inactive", "scheduled", "cancelled"]
  }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").references(() => activities.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  detailedRatings: jsonb("detailed_ratings").$type<{
    cleanliness: number;
    communication: number;
    accuracy: number;
    value: number;
    safety: number;
    experience: number;
  }>(),
  media: jsonb("media").$type<{
    images?: string[];
    videos?: string[];
  }>(),
  status: text("status", {
    enum: ["pending", "published", "flagged", "removed"]
  }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings and reservations
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").references(() => activities.id).notNull(),
  consumerId: integer("consumer_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  guestCount: integer("guest_count").notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled"]
  }).notNull().default("pending"),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "refunded", "failed"]
  }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  vessels: many(vessels),
  activities: many(activities),
  bookings: many(bookings),
  reviewsGiven: many(reviews, { relationName: "userReviews" }),
}));

export const vesselsRelations = relations(vessels, ({ one, many }) => ({
  owner: one(users, {
    fields: [vessels.ownerId],
    references: [users.id],
  }),
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  vessel: one(vessels, {
    fields: [activities.vesselId],
    references: [vessels.id],
  }),
  provider: one(users, {
    fields: [activities.providerId],
    references: [users.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  activity: one(activities, {
    fields: [reviews.activityId],
    references: [activities.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  activity: one(activities, {
    fields: [bookings.activityId],
    references: [activities.id],
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

export const insertVesselSchema = createInsertSchema(vessels);
export const selectVesselSchema = createSelectSchema(vessels);
export type InsertVessel = typeof vessels.$inferInsert;
export type SelectVessel = typeof vessels.$inferSelect;

export const insertActivitySchema = createInsertSchema(activities);
export const selectActivitySchema = createSelectSchema(activities);
export type InsertActivity = typeof activities.$inferInsert;
export type SelectActivity = typeof activities.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = typeof reviews.$inferInsert;
export type SelectReview = typeof reviews.$inferSelect;

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;
