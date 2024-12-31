import { sql } from "drizzle-orm";
import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// Safe migration that updates producer profile structure
export async function up(db: any) {
  // Add producer_profile with a default empty object if it doesn't exist
  await db.schema.alterTable("users").addColumnIfNotExists(
    "producer_profile",
    jsonb("producer_profile")
      .notNull()
      .default({
        role: null,
        experience: {
          yearsOfExperience: 0,
          qualifications: [],
          specialties: [],
          languages: []
        },
        vessels: [],
        certifications: [],
        availability: {
          schedule: [],
          seasonalAvailability: {
            summer: false,
            winter: false,
            spring: false,
            fall: false
          }
        }
      })
  );
}

// Rollback function if needed
export async function down(db: any) {
  // Don't drop the column, just make it nullable to preserve data
  await db.schema.alterTable("users").updateColumn("producer_profile", {
    notNull: false,
    default: null
  });
}
