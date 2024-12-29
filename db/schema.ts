import { pgTable, text, serial, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vessels/Yachts table
export const vessels = pgTable("vessels", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
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
  availability: jsonb("availability").$type<Array<{
    date: Date;
    slots: Array<{
      start: string;
      end: string;
      maxCapacity: number;
    }>;
  }>>().default([]),
  status: text("status", {
    enum: ["available", "maintenance", "booked", "inactive"]
  }).notNull().default("available"),
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
  activityTypes: jsonb("activity_types").$type<Array<{
    name: string;
    isOffered: boolean;
    description?: string;
  }>>().notNull().default([]),
  equipment: jsonb("equipment").$type<Array<{
    name: string;
    description: string;
    quantity: number;
    condition: "new" | "good" | "fair";
  }>>().notNull().default([]),
  safetyMeasures: jsonb("safety_measures").$type<Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    requiredCertifications?: string[];
  }>>().notNull().default([]),
  instructions: jsonb("instructions").$type<Array<{
    step: number;
    title: string;
    description: string;
    imageUrl?: string;
  }>>().notNull().default([]),
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

// Define all relations in one place
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

// Service schemas (alias for vessels)
export const services = vessels;
export const insertServiceSchema = insertVesselSchema;
export const selectServiceSchema = selectVesselSchema;
export type InsertService = InsertVessel;
export type SelectService = SelectVessel;

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