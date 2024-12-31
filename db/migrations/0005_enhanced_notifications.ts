import { sql } from "drizzle-orm";
import { pgTable, text, jsonb } from "drizzle-orm/pg-core";

// Safe migration that updates notification structure
export async function up(db: any) {
  // Add new notification types and categories
  await db.schema.alterTable("notifications")
    .alterColumn("type", (col) => 
      col.setEnum([
        "booking",
        "message",
        "system",
        "payment",
        "maintenance",
        "weather",
        "service_update",
        "promotion",
        "emergency"
      ])
    )
    .alterColumn("category", (col) =>
      col.setEnum([
        "transaction",
        "communication",
        "service",
        "safety",
        "marketing"
      ])
    );

  // Update user notification preferences
  await db.schema.alterTable("users")
    .alterColumn("notification_preferences", (col) =>
      col.type(
        jsonb("notification_preferences")
          .notNull()
          .default({
            email: true,
            sms: true,
            pushNotifications: true,
            categories: {
              booking: true,
              payment: true,
              maintenance: true,
              weather: true,
              system: true,
              marketing: true,
              service_update: true,
              emergency: true
            },
            frequency: "instant",
            quiet_hours: {
              enabled: false,
              start: "22:00",
              end: "07:00",
              timezone: "UTC"
            },
            channels: {
              email: {
                enabled: true,
                categories: ["booking", "payment", "emergency"]
              },
              sms: {
                enabled: true,
                categories: ["emergency"]
              },
              push: {
                enabled: true,
                categories: ["booking", "payment", "maintenance", "weather", "emergency"]
              }
            }
          })
      )
    );
}

// Rollback function if needed
export async function down(db: any) {
  // Revert notification types and categories
  await db.schema.alterTable("notifications")
    .alterColumn("type", (col) =>
      col.setEnum([
        "booking",
        "message",
        "system",
        "payment",
        "maintenance",
        "weather"
      ])
    )
    .alterColumn("category", (col) =>
      col.dropEnum()
    );

  // Revert user notification preferences to previous structure
  await db.schema.alterTable("users")
    .alterColumn("notification_preferences", (col) =>
      col.type(
        jsonb("notification_preferences")
          .notNull()
          .default({
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
          })
      )
    );
}
