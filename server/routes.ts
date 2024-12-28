import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import servicesRouter from "./routes/services";
import bookingsRouter from "./routes/bookings";
import userRouter from "./routes/users";

export function registerRoutes(app: Express): Server {
  // Set up authentication routes and middleware first
  setupAuth(app);

  // Register API routes
  app.use("/api/services", servicesRouter);
  app.use("/api/bookings", bookingsRouter);
  app.use("/api/users", userRouter);

  const httpServer = createServer(app);
  return httpServer;
}