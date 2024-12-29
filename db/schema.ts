import { pgTable, text, serial, timestamp, jsonb, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Users table
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
  verificationStatus: text("verification_status", {
    enum: ["unverified", "pending", "verified", "rejected"]
  }).default("unverified"),

  // Profile fields
  profileImage: text("profile_image"),
  phoneNumber: text("phone_number"),
  bio: text("bio"),
  dateOfBirth: timestamp("date_of_birth"),
  nationality: text("nationality"),
  gender: text("gender"),
  occupation: text("occupation"),

  // Complex JSON fields
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

  privacySettings: jsonb("privacy_settings").$type<{
    profileVisibility: "public" | "private" | "registered";
    contactInfoVisibility: "public" | "private" | "registered";
    experienceVisibility: "public" | "private" | "registered";
    businessInfoVisibility: "public" | "private" | "registered";
  }>(),

  // Consumer-specific fields
  travelPreferences: jsonb("travel_preferences").$type<{
    preferredDestinations: string[];
    travelFrequency?: string;
    typicalTripDuration?: string;
    budgetRange?: {
      min: number;
      max: number;
      currency: string;
    };
    specialRequirements: string[];
  }>(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vessels table
export const vessels = pgTable("vessels", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  manufacturer: text("manufacturer").notNull(),
  year: integer("year").notNull(),
  registrationNumber: text("registration_number"),
  flagState: text("flag_state"),
  length: decimal("length").notNull(),
  beam: decimal("beam").notNull(),
  draft: decimal("draft").notNull(),
  grossTonnage: integer("gross_tonnage"),
  cruisingSpeed: integer("cruising_speed"),
  maxSpeed: integer("max_speed"),
  fuelCapacity: integer("fuel_capacity"),
  waterCapacity: integer("water_capacity"),
  engineDetails: jsonb("engine_details").$type<{
    manufacturer: string;
    model: string;
    power: number;
    hours: number;
    yearInstalled: number;
    lastServiced: string;
  }>(),
  status: text("status", {
    enum: ["available", "maintenance", "booked", "inactive"]
  }).notNull().default("available"),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  vesselId: integer("vessel_id").references(() => vessels.id).notNull(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status", {
    enum: ["active", "inactive"]
  }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").references(() => activities.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  status: text("status", {
    enum: ["pending", "published", "flagged", "removed"]
  }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedVessels: many(vessels),
  providedActivities: many(activities),
  bookings: many(bookings),
  reviews: many(reviews),
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

// Schema exports
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

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = typeof reviews.$inferInsert;
export type SelectReview = typeof reviews.$inferSelect;

// Services alias (for consistency with frontend naming)
export const services = vessels;
export type InsertService = InsertVessel;
export type SelectService = SelectVessel;
export const insertServiceSchema = insertVesselSchema;
export const selectServiceSchema = selectVesselSchema;