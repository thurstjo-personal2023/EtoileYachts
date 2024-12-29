import { Router } from "express";
import { db } from "@db";
import { services, insertServiceSchema } from "@db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get all services
router.get("/", async (req, res) => {
  try {
    const allServices = await db.query.services.findMany({
      with: {
        owner: true
      }
    });
    res.json(allServices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
});

// Get a specific service
router.get("/:id", async (req, res) => {
  try {
    const service = await db.query.services.findFirst({
      where: eq(services.id, parseInt(req.params.id)),
      with: {
        owner: true
      }
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service", error });
  }
});

// Create a new service
router.post("/", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.userType !== "producer") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = insertServiceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const [newService] = await db
      .insert(services)
      .values({
        ...result.data,
        ownerId: req.user.id,
      })
      .returning();

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error });
  }
});

// Update a service
router.put("/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const service = await db.query.services.findFirst({
      where: eq(services.id, parseInt(req.params.id))
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = insertServiceSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const [updatedService] = await db
      .update(services)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(services.id, parseInt(req.params.id)))
      .returning();

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
});

// Delete a service
router.delete("/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const service = await db.query.services.findFirst({
      where: eq(services.id, parseInt(req.params.id))
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db
      .delete(services)
      .where(eq(services.id, parseInt(req.params.id)));

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
});

// Get personalized yacht recommendations
router.post("/recommendations", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { preferences } = req.body;

    if (!preferences || !preferences.preferredSize || !preferences.budget ||
        !preferences.partySize || !preferences.luxuryPreference || !preferences.preferredLocation) {
      return res.status(400).json({ message: "Invalid preferences data" });
    }

    // Get all available yachts
    const availableYachts = await db.query.services.findMany({
      where: eq(services.type, "yacht"),
      with: {
        owner: true
      }
    });

    // Convert to YachtFeatures format
    const yachtFeatures = availableYachts.map(yacht => ({
      size: yacht.specifications?.length ?? 0,
      price: Number(yacht.price),
      capacity: yacht.specifications?.capacity ?? 0,
      luxuryScore: yacht.specifications?.luxuryRating ?? 5,
      location: yacht.location as { lat: number; lng: number },
    }));

    res.json(yachtFeatures);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error });
  }
});

export default router;