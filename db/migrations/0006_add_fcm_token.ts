import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

// Safe migration that adds FCM token field to users
export async function up(db: any) {
  await db.schema.alterTable("users")
    .addColumnIfNotExists(
      "fcm_token",
      text("fcm_token")
    );
}

// Rollback function if needed
export async function down(db: any) {
  // Don't drop the column to preserve data
  await db.schema.alterTable("users")
    .dropColumnIfExists("fcm_token");
}
