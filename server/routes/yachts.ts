import { Router } from "express";
import { db } from "@db";
import { vessels, insertVesselSchema } from "@db/schema";
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

// Get all yachts
router.get("/", async (req, res) => {
  try {
    const allYachts = await db.query.vessels.findMany({
      with: {
        owner: true
      }
    });
    res.json(allYachts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching yachts", error });
  }
});

// Get a specific yacht
router.get("/:id", async (req, res) => {
  try {
    const yacht = await db.query.vessels.findFirst({
      where: eq(vessels.id, parseInt(req.params.id)),
      with: {
        owner: true
      }
    });

    if (!yacht) {
      return res.status(404).json({ message: "Yacht not found" });
    }

    res.json(yacht);
  } catch (error) {
    res.status(500).json({ message: "Error fetching yacht", error });
  }
});

// Create a new yacht
router.post("/", requireAuth, async (req, res) => {
  try {
    const result = insertVesselSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const [newYacht] = await db
      .insert(vessels)
      .values({
        ...result.data,
        ownerId: req.user!.id,
      })
      .returning();

    res.status(201).json(newYacht);
  } catch (error) {
    res.status(500).json({ message: "Error creating yacht", error });
  }
});

// Update a yacht
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const yacht = await db.query.vessels.findFirst({
      where: eq(vessels.id, parseInt(req.params.id))
    });

    if (!yacht) {
      return res.status(404).json({ message: "Yacht not found" });
    }

    if (yacht.ownerId !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = insertVesselSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const [updatedYacht] = await db
      .update(vessels)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(vessels.id, parseInt(req.params.id)))
      .returning();

    res.json(updatedYacht);
  } catch (error) {
    res.status(500).json({ message: "Error updating yacht", error });
  }
});

// Delete a yacht
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const yacht = await db.query.vessels.findFirst({
      where: eq(vessels.id, parseInt(req.params.id))
    });

    if (!yacht) {
      return res.status(404).json({ message: "Yacht not found" });
    }

    if (yacht.ownerId !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db
      .delete(vessels)
      .where(eq(vessels.id, parseInt(req.params.id)));

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting yacht", error });
  }
});

export default router;
