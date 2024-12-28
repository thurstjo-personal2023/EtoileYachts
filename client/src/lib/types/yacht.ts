import { z } from "zod";

export const yachtDetailsSchema = z.object({
  name: z.string().min(2, "Yacht name must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  year: z.number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  capacity: z.number()
    .min(1, "Capacity must be at least 1")
    .max(500, "Capacity seems unusually high"),
  features: z.object({
    hasSpa: z.boolean(),
    hasDiningArea: z.boolean(),
    hasChildFriendlyAmenities: z.boolean(),
    additionalFeatures: z.array(z.string())
  }),
  availability: z.array(z.object({
    date: z.date(),
    slots: z.array(z.object({
      start: z.string(),
      end: z.string(),
      maxCapacity: z.number().optional()
    }))
  }))
});

export type YachtDetails = z.infer<typeof yachtDetailsSchema>;
