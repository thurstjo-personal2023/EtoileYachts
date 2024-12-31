import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { users, insertUserSchema, type SelectUser } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);
const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  },
  compare: async (suppliedPassword: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  },
};

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || "etoile-yachts-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      secure: true,
    };
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username: string, password: string, done) => {
      try {
        console.log(`[Auth] Attempting login for username: ${username}`);

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);

        if (!user) {
          console.log(`[Auth] User not found: ${username}`);
          return done(null, false, { message: "Incorrect username or password" });
        }

        console.log(`[Auth] Verifying password for user: ${username}`);
        const isMatch = await crypto.compare(password, user.password);

        if (!isMatch) {
          console.log(`[Auth] Password verification failed for user: ${username}`);
          return done(null, false, { message: "Incorrect username or password" });
        }

        console.log(`[Auth] Login successful for user: ${username}`);
        return done(null, user);
      } catch (err) {
        console.error("[Auth] Login error:", err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log(`[Auth] Serializing user: ${user.id}`);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log(`[Auth] Deserializing user: ${id}`);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        console.log(`[Auth] User not found during deserialization: ${id}`);
        return done(null, false);
      }

      done(null, user);
    } catch (err) {
      console.error("[Auth] Deserialization error:", err);
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("[Auth] Registration attempt:", req.body);

      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = result.error.issues.map(i => i.message).join(", ");
        console.log("[Auth] Registration validation failed:", errorMessage);
        return res.status(400).json({ message: "Invalid input: " + errorMessage });
      }

      const { username, email, password, fullName, userType, ...otherData } = result.data;

      // Check if username already exists
      const [existingUsername] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUsername) {
        console.log(`[Auth] Registration failed: Username ${username} already exists`);
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email already exists
      const [existingEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingEmail) {
        console.log(`[Auth] Registration failed: Email ${email} already exists`);
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await crypto.hash(password);

      // Create the new user with default values for required fields
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email,
          password: hashedPassword,
          fullName,
          userType,
          notificationPreferences: {
            email: true,
            sms: true,
            pushNotifications: true,
            categories: {
              booking: true,
              payment: true,
              maintenance: true,
              weather: true,
              system: true,
              marketing: true
            },
            frequency: "instant"
          },
          privacySettings: {
            profileVisibility: "public",
            contactVisibility: "registered",
            servicesVisibility: "public",
            portfolioVisibility: "public",
            reviewsVisibility: "public"
          },
          ...otherData
        })
        .returning();

      console.log(`[Auth] User registered successfully: ${username}`);

      req.login(newUser, (err) => {
        if (err) {
          console.error("[Auth] Login after registration failed:", err);
          return next(err);
        }
        return res.json({
          message: "Registration successful",
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            userType: newUser.userType,
            fullName: newUser.fullName,
          },
        });
      });
    } catch (error) {
      console.error("[Auth] Registration error:", error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("[Auth] Login attempt body:", req.body);

    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ 
        message: "Missing credentials. Both username and password are required." 
      });
    }

    passport.authenticate("local", (err: any, user: Express.User | false, info: IVerifyOptions) => {
      if (err) {
        console.error("[Auth] Authentication error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!user) {
        console.log("[Auth] Authentication failed:", info.message);
        return res.status(400).json({ message: info.message ?? "Invalid credentials" });
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error("[Auth] Login error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        console.log(`[Auth] Login successful for user: ${user.username}`);
        return res.json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            userType: user.userType,
            fullName: user.fullName,
          },
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    const username = req.user?.username;
    console.log(`[Auth] Logout attempt for user: ${username}`);

    req.logout((err) => {
      if (err) {
        console.error("[Auth] Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      console.log(`[Auth] Logout successful for user: ${username}`);
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      console.log(`[Auth] Current user session: ${user.username}`);
      return res.json(user);
    }
    console.log("[Auth] No authenticated user session found");
    res.status(401).json({ message: "Not logged in" });
  });
}