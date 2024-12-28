import { Router } from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Profile update validation schema
const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  preferredLanguage: z.string().optional(),
  bio: z.string().optional(),
  location: z.object({
    country: z.string(),
    city: z.string(),
  }).optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    pushNotifications: z.boolean(),
  }).optional(),
});

// Get user profile
router.get("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const [userProfile] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove sensitive information
    const { password, ...profile } = userProfile;
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const result = updateProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const [updatedProfile] = await db
      .update(users)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user.id))
      .returning();

    // Remove sensitive information
    const { password, ...profile } = updatedProfile;
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

// Handle profile image upload
router.post("/profile/image", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // TODO: Implement file upload logic
    // For now, we'll accept a base64 image string
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const [updatedProfile] = await db
      .update(users)
      .set({
        profileImage: image,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user.id))
      .returning();

    // Remove sensitive information
    const { password, ...profile } = updatedProfile;
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile image", error });
  }
});

export default router;
