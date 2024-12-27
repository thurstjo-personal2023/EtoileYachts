import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { yachts, bookings, reviews, User } from "@db/schema";
import { eq } from "drizzle-orm";
import { setupAuth } from "./auth";

// Extend Express Request type for authenticated routes
interface AuthenticatedRequest extends Omit<Request, "user"> {
  user?: User;
  isAuthenticated(): boolean;
}

export function registerRoutes(app: Express): Server {
  // Setup authentication routes first
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Yacht routes
  app.get("/api/yachts", async (_req, res) => {
    try {
      const allYachts = await db.query.yachts.findMany({
        with: {
          reviews: true,
        },
      });
      res.json(allYachts);
    } catch (error) {
      console.error("Error fetching yachts:", error);
      res.status(500).json({ error: "Failed to fetch yachts" });
    }
  });

  app.get("/api/yachts/:id", async (req, res) => {
    try {
      const [yacht] = await db.query.yachts.findMany({
        where: eq(yachts.id, parseInt(req.params.id)),
        with: {
          reviews: {
            with: {
              user: true,
            },
          },
        },
      });

      if (!yacht) {
        return res.status(404).json({ error: "Yacht not found" });
      }

      res.json(yacht);
    } catch (error) {
      console.error("Error fetching yacht details:", error);
      res.status(500).json({ error: "Failed to fetch yacht details" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { yachtId, startDate, endDate, totalPrice } = req.body;
      const [booking] = await db.insert(bookings)
        .values({
          userId: req.user.id,
          yachtId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          status: "pending",
        })
        .returning();

      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  return httpServer;
}