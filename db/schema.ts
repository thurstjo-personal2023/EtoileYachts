import { pgTable, text, serial, timestamp, json, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  fullName: text("fullName").notNull(),
  userType: text("userType").notNull().default("consumer"), // consumer, producer, or partner
  phoneNumber: text("phoneNumber"),
  profileImage: text("profileImage"),
  preferredLanguage: text("preferredLanguage").default("en"),
  notificationPreferences: json("notificationPreferences").$type<{
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
  }>().default({
    email: true,
    sms: false,
    pushNotifications: true,
  }),
  bio: text("bio"),
  location: json("location").$type<{
    country: string;
    city: string;
  }>(),
  verificationStatus: text("verificationStatus").default("unverified"), // unverified, pending, verified
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("providerId").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // yacht, water_sports, catering, etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  location: json("location").notNull().$type<{
    lat: number;
    lng: number;
  }>(),
  images: json("images").$type<string[]>(), // array of image URLs
  availability: json("availability").$type<string[]>().notNull(), // array of available time slots
  specifications: json("specifications").$type<{
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
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  paymentStatus: text("paymentStatus").notNull().default("pending"), // pending, paid, refunded
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  providedServices: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  provider: one(users, {
    fields: [services.providerId],
    references: [users.id],
  }),
}));


// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);
export type InsertService = typeof services.$inferInsert;
export type SelectService = typeof services.$inferSelect;

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;