import { Router } from "express";
import { db } from "@db";
import { notifications } from "@db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get all notifications for the current user
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, req.user.id),
      orderBy: (notifications, { desc }) => [desc(notifications.timestamp)],
    });
    res.json(userNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Register device token for push notifications
router.post("/register-device", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Device token is required" });
  }

  try {
    await db
      .update(notifications)
      .set({ deviceToken: token })
      .where(eq(notifications.userId, req.user.id));
    res.json({ message: "Device token registered successfully" });
  } catch (error) {
    console.error("Error registering device token:", error);
    res.status(500).json({ message: "Failed to register device token" });
  }
});

// Mark notification as read
router.post("/:id/read", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, parseInt(id)));
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

export default router;
