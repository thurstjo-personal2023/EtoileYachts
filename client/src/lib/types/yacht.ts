import { z } from "zod";

export const yachtDetailsSchema = z.object({
  name: z.string().min(2, "Yacht name must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  manufacturer: z.string().min(2, "Manufacturer must be at least 2 characters"),
  year: z.number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  registrationNumber: z.string().optional(),
  flagState: z.string().optional(),

  // Technical Specifications
  length: z.number().positive("Length must be positive"),
  beam: z.number().positive("Beam must be positive"),
  draft: z.number().positive("Draft must be positive"),
  grossTonnage: z.number().optional(),
  cruisingSpeed: z.number().optional(),
  maxSpeed: z.number().optional(),
  fuelCapacity: z.number().optional(),
  waterCapacity: z.number().optional(),

  // Engine Details
  engineDetails: z.object({
    manufacturer: z.string(),
    model: z.string(),
    power: z.number(),
    hours: z.number(),
    yearInstalled: z.number(),
    lastServiced: z.string(),
  }).optional(),

  // Accommodation
  capacity: z.number().min(1, "Capacity must be at least 1"),
  cabins: z.number().min(1, "Must have at least 1 cabin"),
  berths: z.number().min(1, "Must have at least 1 berth"),
  crew: z.number().optional(),

  // Features
  features: z.object({
    hasSpa: z.boolean(),
    hasDiningArea: z.boolean(),
    hasChildFriendlyAmenities: z.boolean(),
    waterToys: z.array(z.string()),
    entertainment: z.array(z.string()),
    navigation: z.array(z.string()),
    safety: z.array(z.string()),
    additionalFeatures: z.array(z.string())
  }),

  // Layout
  layout: z.object({
    deckPlans: z.array(z.object({
      deck: z.string(),
      description: z.string(),
      areas: z.array(z.object({
        name: z.string(),
        type: z.string(),
        features: z.array(z.string())
      }))
    })),
    interiorDesigner: z.string().optional(),
    lastRefitted: z.string().optional()
  }).optional(),

  // Certificates
  certificates: z.array(z.object({
    type: z.string(),
    number: z.string(),
    issueDate: z.string(),
    expiryDate: z.string(),
    issuingAuthority: z.string()
  })).default([]),

  // Availability
  availability: z.array(z.object({
    date: z.date(),
    slots: z.array(z.object({
      start: z.string(),
      end: z.string(),
      maxCapacity: z.number()
    }))
  })),

  // Location
  homePort: z.string().optional(),
  cruisingAreas: z.array(z.string()).default([]),
  currentLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    lastUpdated: z.string()
  }).optional(),

  // Charter Details
  charterType: z.enum(["crewed", "bareboat", "cabin"]),
  baseDayRate: z.number().positive("Day rate must be positive"),
  baseWeekRate: z.number().positive("Week rate must be positive"),
  currency: z.string().default("USD")
});

export type YachtDetails = z.infer<typeof yachtDetailsSchema>;