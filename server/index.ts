import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import { createServer } from 'http';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware with enhanced debugging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Enhanced request logging
  log(`Incoming ${req.method} request to ${path}`);
  if (req.headers['sec-websocket-protocol']) {
    log(`WebSocket request with protocol: ${req.headers['sec-websocket-protocol']}`);
  }

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Create HTTP server first
    const server = createServer(app);

    // Setup Vite in development (must be first for proper WebSocket handling)
    if (app.get("env") === "development") {
      log("Setting up Vite development server");
      await setupVite(app, server);
    }

    // Setup authentication after Vite
    log("Setting up authentication");
    setupAuth(app);

    // Register API routes
    log("Registering API routes");
    registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      log(`Error encountered: ${err.message}`);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Serve static files in production
    if (app.get("env") !== "development") {
      log("Setting up static file serving for production");
      serveStatic(app);
    }

    // Start the server
    const PORT = 5000;
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    log(`Fatal server error: ${error}`);
    throw error;
  }
})();