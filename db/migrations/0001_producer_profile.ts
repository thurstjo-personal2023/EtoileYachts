import { sql } from "drizzle-orm";
import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// Safe migration that adds new columns without removing existing ones
export async function up(db) {
  await db.schema.alterTable("users").addColumn(
    "producer_profile",
    jsonb("producer_profile").default("{}").notNull()
  );
}

// Rollback function if needed
export async function down(db) {
  await db.schema.alterTable("users").dropColumn("producer_profile");
}
