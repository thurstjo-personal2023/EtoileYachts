import { Router } from "express";
import { db } from "@db";
import { activities, insertActivitySchema } from "@db/schema";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "express";

const router = Router();

// Authentication middleware
const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Get all activities
router.get("/", async (req, res) => {
  try {
    const allActivities = await db.query.activities.findMany({
      with: {
        vessel: true,
        provider: true
      }
    });
    res.json(allActivities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
});

// Get a specific activity
router.get("/:id", async (req, res) => {
  try {
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, parseInt(req.params.id)),
      with: {
        vessel: true,
        provider: true
      }
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity", error });
  }
});

// Create a new activity
router.post("/", requireAuth, async (req, res) => {
  try {
    const result = insertActivitySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const [newActivity] = await db
      .insert(activities)
      .values({
        ...result.data,
        providerId: req.user!.id,
      })
      .returning();

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: "Error creating activity", error });
  }
});

// Update an activity
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, parseInt(req.params.id))
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.providerId !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = insertActivitySchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const [updatedActivity] = await db
      .update(activities)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(activities.id, parseInt(req.params.id)))
      .returning();

    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: "Error updating activity", error });
  }
});

// Delete an activity
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, parseInt(req.params.id))
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.providerId !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db
      .delete(activities)
      .where(eq(activities.id, parseInt(req.params.id)));

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity", error });
  }
});

export default router;
