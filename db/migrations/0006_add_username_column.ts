import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

// Safe migration that adds username column
export async function up(db: any) {
  await db.schema.alterTable("users").addColumn(
    "username",
    text("username").unique().notNull().default(sql`email`)  // temporarily use email as username
  );
}

// Rollback function if needed
export async function down(db: any) {
  await db.schema.alterTable("users").dropColumn("username");
}
