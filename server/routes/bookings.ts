import { Router } from "express";
import { db } from "@db";
import { bookings, services, insertBookingSchema } from "@db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

const router = Router();

// Get all bookings for the authenticated user
router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const userBookings = await db.query.bookings.findMany({
      with: {
        service: {
          columns: {
            providerId: true
          }
        }
      },
      where: req.user.userType === "consumer" 
        ? eq(bookings.consumerId, req.user.id)
        : eq(services.providerId, req.user.id)
    });

    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

// Get a specific booking
router.get("/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, parseInt(req.params.id)),
      with: {
        service: {
          columns: {
            providerId: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user has access to this booking
    if (
      req.user.userType === "consumer" && booking.consumerId !== req.user.id ||
      req.user.userType === "producer" && booking.service.providerId !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
});

// Create a new booking
router.post("/", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.userType !== "consumer") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = insertBookingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map(i => i.message),
      });
    }

    const { serviceId, startTime, endTime } = result.data;

    // Check if service exists
    const service = await db.query.services.findFirst({
      where: eq(services.id, serviceId)
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check for booking conflicts
    const conflicts = await db.query.bookings.findMany({
      where: and(
        eq(bookings.serviceId, serviceId),
        eq(bookings.status, "confirmed"),
        gte(bookings.startTime, new Date(startTime)),
        lte(bookings.endTime, new Date(endTime))
      )
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    // Calculate total amount based on service price and duration
    const hours = (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60);
    const totalAmount = (Number(service.price) * hours).toFixed(2);

    const [newBooking] = await db
      .insert(bookings)
      .values({
        serviceId: serviceId,
        consumerId: req.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "pending",
        totalAmount: totalAmount,
        paymentStatus: "pending"
      })
      .returning();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});

// Update booking status
router.patch("/:id/status", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { status } = req.body;
    if (!["confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, parseInt(req.params.id)),
      with: {
        service: true
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only service providers can update booking status
    if (booking.service.providerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, parseInt(req.params.id)))
      .returning();

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error });
  }
});

export default router;