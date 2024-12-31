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
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email: string, password: string, done) => {
        try {
          console.log(`[Auth] Attempting login for email: ${email}`);

          // Select user fields necessary for authentication
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (!user) {
            console.log(`[Auth] User not found: ${email}`);
            return done(null, false, { message: "Incorrect email or password" });
          }

          console.log(`[Auth] Verifying password for user: ${email}`);
          const isMatch = await crypto.compare(password, user.password);

          if (!isMatch) {
            console.log(`[Auth] Password verification failed for user: ${email}`);
            return done(null, false, { message: "Incorrect email or password" });
          }

          console.log(`[Auth] Login successful for user: ${email}`);
          return done(null, user);
        } catch (err) {
          console.error("[Auth] Login error:", err);
          return done(err);
        }
      }
    )
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

      const { email, password, userType, fullName } = result.data;

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        console.log(`[Auth] Registration failed: Email ${email} already exists`);
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await crypto.hash(password);

      // Create the new user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          userType,
          fullName,
        })
        .returning();

      console.log(`[Auth] User registered successfully: ${email}`);

      req.login(newUser, (err) => {
        if (err) {
          console.error("[Auth] Login after registration failed:", err);
          return next(err);
        }
        return res.json({
          message: "Registration successful",
          user: {
            id: newUser.id,
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

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ 
        message: "Missing credentials. Both email and password are required." 
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

        console.log(`[Auth] Login successful for user: ${user.email}`);
        return res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            userType: user.userType,
            fullName: user.fullName,
          },
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    const email = req.user?.email;
    console.log(`[Auth] Logout attempt for user: ${email}`);

    req.logout((err) => {
      if (err) {
        console.error("[Auth] Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      console.log(`[Auth] Logout successful for user: ${email}`);
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      console.log(`[Auth] Current user session: ${user.email}`);
      return res.json(user);
    }
    console.log("[Auth] No authenticated user session found");
    res.status(401).json({ message: "Not logged in" });
  });
}