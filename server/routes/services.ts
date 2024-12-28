import { Router } from "express";
import { db } from "@db";
import { services, insertServiceSchema } from "@db/schema";
import { eq, and, between } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

// Get all services with optional filtering
router.get("/", async (req, res) => {
  try {
    const { type, location, priceRange } = req.query;

    const query = db.query.services.findMany({
      where: and(
        type ? eq(services.type, type as string) : undefined,
        location ? and(
          between(
            sql`${services.location}->>'lat'`,
            (JSON.parse(location as string).lat - JSON.parse(location as string).radius).toString(),
            (JSON.parse(location as string).lat + JSON.parse(location as string).radius).toString()
          ),
          between(
            sql`${services.location}->>'lng'`,
            (JSON.parse(location as string).lng - JSON.parse(location as string).radius).toString(),
            (JSON.parse(location as string).lng + JSON.parse(location as string).radius).toString()
          )
        ) : undefined,
        priceRange ? and(
          sql`CAST(${services.price} AS DECIMAL) >= ${JSON.parse(priceRange as string).min}`,
          sql`CAST(${services.price} AS DECIMAL) <= ${JSON.parse(priceRange as string).max}`
        ) : undefined
      ),
      with: {
        provider: true
      }
    });

    const allServices = await query;
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
        provider: true
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
        providerId: req.user.id,
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

    if (service.providerId !== req.user.id) {
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

    if (service.providerId !== req.user.id) {
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

export default router;