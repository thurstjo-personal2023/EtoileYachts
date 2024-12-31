import { Router } from "express";
import { db } from "@db";
import { users, notifications, bookings, reviews } from "@db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get all yacht services
router.get("/", async (req, res) => {
  try {
    const allYachtServices = await db.query.users.findMany({
      where: eq(users.userType, "producer"),
      with: {
        bookings: true,
        reviews: true
      }
    });
    res.json(allYachtServices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
});

// Get a specific yacht service
router.get("/:id", async (req, res) => {
  try {
    const service = await db.query.users.findFirst({
      where: eq(users.id, parseInt(req.params.id)),
      with: {
        bookings: true,
        reviews: true
      }
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service", error });
  }
});

// Get personalized yacht recommendations
router.post("/recommendations", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { preferences } = req.body;

    if (!preferences || !preferences.preferredSize || !preferences.budget ||
        !preferences.partySize || !preferences.luxuryPreference || !preferences.preferredLocation) {
      return res.status(400).json({ message: "Invalid preferences data" });
    }

    // Get all available yacht producers
    const availableYachts = await db.query.users.findMany({
      where: eq(users.userType, "producer"),
      with: {
        reviews: true
      }
    });

    // Convert to YachtFeatures format using producer profiles
    const yachtFeatures = availableYachts.map(producer => {
      const yachtDetails = producer.producerProfile?.yachtDetails?.[0];
      if (!yachtDetails) return null;

      // Calculate a luxury score based on available features
      const luxuryScore = calculateLuxuryScore(yachtDetails);

      return {
        size: yachtDetails.technicalSpecs?.length ?? 0,
        price: producer.availability?.pricing?.baseRate ?? 0,
        capacity: yachtDetails.capacity ?? 0,
        luxuryScore,
        // Since we don't have location in the schema, we'll need to implement this later
        // For now, return null to indicate location data is not available
        location: null
      };
    }).filter(Boolean);

    res.json(yachtFeatures);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error });
  }
});

// Helper function to calculate luxury score based on yacht features
function calculateLuxuryScore(yachtDetails: any): number {
  let score = 5; // Base score

  // Add points for various luxury features
  if (yachtDetails.features?.interior?.length) {
    score += Math.min(yachtDetails.features.interior.length, 3);
  }

  if (yachtDetails.features?.entertainment?.length) {
    score += Math.min(yachtDetails.features.entertainment.length, 2);
  }

  if (yachtDetails.features?.waterToys?.length) {
    score += Math.min(yachtDetails.features.waterToys.length, 2);
  }

  // Cap the score at 10
  return Math.min(score, 10);
}

export default router;