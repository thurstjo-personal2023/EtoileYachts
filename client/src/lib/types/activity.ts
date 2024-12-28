import { z } from "zod";

export const activityDetailsSchema = z.object({
  types: z.array(z.object({
    name: z.string(),
    isOffered: z.boolean(),
    description: z.string().optional()
  })),
  equipment: z.array(z.object({
    name: z.string(),
    description: z.string(),
    quantity: z.number().min(1),
    condition: z.enum(["new", "good", "fair"])
  })),
  safetyMeasures: z.array(z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(["high", "medium", "low"]),
    requiredCertifications: z.array(z.string()).optional()
  })),
  instructions: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional()
  }))
});

export type ActivityDetails = z.infer<typeof activityDetailsSchema>;
