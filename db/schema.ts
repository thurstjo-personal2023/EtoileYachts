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
  dateOfBirth: date("date_of_birth"),
  nationality: text("nationality"),
  identificationNumber: text("identification_number"),

  // Location and Contact
  location: jsonb("location").$type<{
    country: string;
    city: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>(),

  // Professional Information (for producers)
  professionalInfo: jsonb("professional_info").$type<{
    yearsOfExperience: number;
    qualifications: string[];
    specializations: string[];
    languages: string[];
    availability: {
      timezone: string;
      workingHours: Array<{
        day: string;
        start: string;
        end: string;
      }>;
      vacationDates: string[];
    };
    portfolio?: {
      description: string;
      achievements: string[];
      featuredServices: number[];
    };
    safetyRecord?: {
      incidentCount: number;
      lastIncidentDate?: string;
      safetyRating: number;
    };
  }>().default({
    yearsOfExperience: 0,
    qualifications: [],
    specializations: [],
    languages: ["English"],
    availability: {
      timezone: "UTC",
      workingHours: [],
      vacationDates: []
    }
  }),

  // Legal Information (for producers)
  legalInfo: jsonb("legal_info").$type<{
    businessRegistration?: {
      number: string;
      country: string;
      expiryDate: string;
    };
    taxIdentification?: {
      number: string;
      country: string;
    };
    insurancePolicies: Array<{
      type: string;
      provider: string;
      policyNumber: string;
      coverage: number;
      expiryDate: string;
    }>;
    complianceStatus: {
      isCompliant: boolean;
      lastVerified: string;
      certificates: Array<{
        type: string;
        number: string;
        expiryDate: string;
      }>;
    };
  }>().default({
    insurancePolicies: [],
    complianceStatus: {
      isCompliant: false,
      lastVerified: new Date().toISOString(),
      certificates: []
    }
  }),

  // Settings and Preferences
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

// Vessels owned/managed by producers
export const vessels = pgTable("vessels", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  manufacturer: text("manufacturer"),
  model: text("model"),
  year: integer("year"),
  length: decimal("length", { precision: 5, scale: 2 }),
  capacity: integer("capacity"),
  registration: jsonb("registration").$type<{
    number: string;
    country: string;
    expiryDate: string;
    documentUrl: string;
  }>(),
  specifications: jsonb("specifications").$type<{
    engine: {
      type: string;
      power: string;
      hours?: number;
    };
    fuel: {
      type: string;
      capacity: number;
    };
    features: string[];
    safetyEquipment: string[];
  }>(),
  maintenance: jsonb("maintenance").$type<Array<{
    date: string;
    type: string;
    description: string;
    provider: string;
    cost: number;
    nextDueDate: string;
  }>>(),
  insurance: jsonb("insurance").$type<{
    provider: string;
    policyNumber: string;
    coverage: {
      type: string;
      amount: number;
    }[];
    expiryDate: string;
  }>(),
  status: text("status", {
    enum: ["active", "maintenance", "inactive"]
  }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service offerings by producers
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  vesselId: integer("vessel_id").references(() => vessels.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  pricing: jsonb("pricing").$type<{
    baseRate: number;
    currency: string;
    unit: "hour" | "day" | "week" | "month";
    minimumDuration: number;
    maximumDuration?: number;
    securityDeposit?: number;
    additionalFees?: Array<{
      name: string;
      amount: number;
      type: "fixed" | "percentage";
      optional: boolean;
    }>;
    cancellationPolicy: {
      type: "flexible" | "moderate" | "strict";
      refundPercentage: number;
      minimumNotice: number; // hours
    };
  }>().notNull(),
  details: jsonb("details").$type<{
    included: string[];
    excluded: string[];
    requirements: string[];
    restrictions: string[];
    cancellationPolicy: string;
    termsAndConditions: string;
  }>(),
  availability: jsonb("availability").$type<{
    regularHours: Array<{
      day: string;
      slots: Array<{
        start: string;
        end: string;
      }>;
    }>;
    blackoutDates: string[];
    customAvailability: Array<{
      date: string;
      slots: Array<{
        start: string;
        end: string;
      }>;
    }>;
  }>().notNull(),
  location: jsonb("location").$type<{
    country: string;
    city: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    serviceArea?: {
      radius: number;
      unit: string;
    };
  }>().notNull(),
  media: jsonb("media").$type<{
    images: string[];
    videos?: string[];
    virtualTour?: string;
    documents?: string[];
  }>(),
  status: text("status", {
    enum: ["draft", "published", "suspended"]
  }).notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews and Ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
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
  providerResponse: jsonb("provider_response").$type<{
    response: string;
    respondedAt: string;
  }>(),
  status: text("status", {
    enum: ["pending", "published", "flagged", "removed"]
  }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Certifications and Licenses
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  issuedDate: date("issued_date").notNull(),
  expiryDate: date("expiry_date"),
  licenseNumber: text("license_number"),
  documentUrl: text("document_url"),
  verificationStatus: text("verification_status", {
    enum: ["pending", "verified", "rejected"]
  }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings and Reservations
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  consumerId: integer("consumer_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  pricing: jsonb("pricing").$type<{
    baseRate: number;
    additionalFees: Array<{
      name: string;
      amount: number;
    }>;
    discounts: Array<{
      name: string;
      amount: number;
      type: "fixed" | "percentage";
    }>;
    securityDeposit: number;
    total: number;
    currency: string;
  }>().notNull(),
  guestInfo: jsonb("guest_info").$type<{
    count: number;
    names?: string[];
    specialRequests?: string[];
  }>(),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled"]
  }).notNull().default("pending"),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "refunded", "failed"]
  }).notNull().default("pending"),
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


// Define Relations
export const usersRelations = relations(users, ({ many }) => ({
  vessels: many(vessels),
  services: many(services),
  bookings: many(bookings),
  certifications: many(certifications),
  reviewsGiven: many(reviews, { relationName: "userReviews" }),
  documents: many(documents)
}));

export const vesselsRelations = relations(vessels, ({ one, many }) => ({
  owner: one(users, {
    fields: [vessels.ownerId],
    references: [users.id],
  }),
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  provider: one(users, {
    fields: [services.providerId],
    references: [users.id],
  }),
  vessel: one(vessels, {
    fields: [services.vesselId],
    references: [vessels.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  service: one(services, {
    fields: [reviews.serviceId],
    references: [services.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
  user: one(users, {
    fields: [certifications.userId],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  consumer: one(users, {
    fields: [bookings.consumerId],
    references: [users.id],
  }),
  reviews: many(reviews),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
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

export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);
export type InsertService = typeof services.$inferInsert;
export type SelectService = typeof services.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = typeof reviews.$inferInsert;
export type SelectReview = typeof reviews.$inferSelect;

export const insertCertificationSchema = createInsertSchema(certifications);
export const selectCertificationSchema = createSelectSchema(certifications);
export type InsertCertification = typeof certifications.$inferInsert;
export type SelectCertification = typeof certifications.$inferSelect;

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;

export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);
export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;