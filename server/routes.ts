import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import servicesRouter from "./routes/services";
import bookingsRouter from "./routes/bookings";
import userRouter from "./routes/users";
import yachtRouter from "./routes/yachts";
import activityRouter from "./routes/activities";

export function registerRoutes(app: Express): Server {
  // Set up authentication routes and middleware first
  setupAuth(app);

  // Register API routes
  app.use("/api/services", servicesRouter);
  app.use("/api/bookings", bookingsRouter);
  app.use("/api/users", userRouter);
  app.use("/api/yachts", yachtRouter);
  app.use("/api/activities", activityRouter);

  const httpServer = createServer(app);
  return httpServer;
}