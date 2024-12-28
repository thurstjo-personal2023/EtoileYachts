import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import servicesRouter from "./routes/services";
import bookingsRouter from "./routes/bookings";

export function registerRoutes(app: Express): Server {
  // Set up authentication routes first
  setupAuth(app);

  // Register API routes
  app.use("/api/services", servicesRouter);
  app.use("/api/bookings", bookingsRouter);

  const httpServer = createServer(app);
  return httpServer;
}