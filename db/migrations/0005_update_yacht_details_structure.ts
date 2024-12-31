import { sql } from "drizzle-orm";
import { pgTable, jsonb } from "drizzle-orm/pg-core";

// Safe migration that updates yacht details structure
export async function up(db: any) {
  await db.schema.alterTable("users").updateColumn(
    "producer_profile",
    jsonb("producer_profile")
      .notNull()
      .default({
        personalInfo: {
          fullName: "",
          email: "",
          phoneNumber: "",
          dateOfBirth: null,
          nationality: "",
          languages: [],
          address: ""
        },
        professionalInfo: {
          role: null,
          experience: {
            yearsOfExperience: 0,
            specialties: [],
            previousRoles: []
          },
          certifications: []
        },
        yachtDetails: [{
          name: "",
          type: "",
          manufacturer: "",
          model: "",
          year: null,
          specifications: {
            length: "",
            beam: "",
            enginePower: "",
            fuelType: ""
          },
          capacity: {
            guests: null,
            crew: null
          },
          features: {
            amenities: []
          },
          media: {
            photos: [],
            videos: []
          }
        }],
        availability: {
          schedule: [],
          preferences: {
            minimumDuration: null,
            maximumDuration: null,
            noticeRequired: null,
            seasonalPreferences: []
          }
        },
        notificationSettings: {
          email: true,
          sms: true,
          pushNotifications: true,
          bookingReminders: true,
          paymentAlerts: true,
          maintenanceAlerts: true,
          weatherAlerts: true
        }
      })
  );
}

// Rollback function if needed
export async function down(db: any) {
  // Keep the previous structure in case of rollback
  await db.schema.alterTable("users").updateColumn(
    "producer_profile",
    jsonb("producer_profile")
      .notNull()
      .default({})
  );
}
