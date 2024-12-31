import { Router } from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "express";

const router = Router();

// Authentication middleware
const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Get all yachts
router.get("/", async (req, res) => {
  try {
    const producers = await db.query.users.findMany({
      where: eq(users.userType, "producer"),
      columns: {
        id: true,
        fullName: true,
        businessName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        producerProfile: true,
        availability: true,
        mediaGallery: true,
        verificationStatus: true,
      }
    });

    // Transform the data to return only yacht details
    const yachts = producers.flatMap(producer => {
      return producer.producerProfile?.yachtDetails?.map(yacht => ({
        id: `${producer.id}-${yacht.name}`, // Create a unique ID
        ownerId: producer.id,
        ownerName: producer.fullName,
        businessName: producer.businessName,
        ...yacht,
        pricing: producer.availability?.pricing,
        media: producer.mediaGallery?.photos?.filter(
          photo => photo.type === "yacht_exterior" || photo.type === "yacht_interior"
        ),
        verificationStatus: producer.verificationStatus
      })) || [];
    });

    res.json(yachts);
  } catch (error) {
    console.error("Error fetching yachts:", error);
    res.status(500).json({ message: "Error fetching yachts", error });
  }
});

// Get a specific yacht
router.get("/:id", async (req, res) => {
  try {
    const [ownerId, yachtName] = req.params.id.split("-");

    const producer = await db.query.users.findFirst({
      where: eq(users.id, parseInt(ownerId)),
      columns: {
        id: true,
        fullName: true,
        businessName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        producerProfile: true,
        availability: true,
        mediaGallery: true,
        verificationStatus: true,
      }
    });

    if (!producer) {
      return res.status(404).json({ message: "Yacht owner not found" });
    }

    const yacht = producer.producerProfile?.yachtDetails?.find(
      yacht => yacht.name === yachtName
    );

    if (!yacht) {
      return res.status(404).json({ message: "Yacht not found" });
    }

    res.json({
      id: req.params.id,
      ownerId: producer.id,
      ownerName: producer.fullName,
      businessName: producer.businessName,
      ...yacht,
      pricing: producer.availability?.pricing,
      media: producer.mediaGallery?.photos?.filter(
        photo => photo.type === "yacht_exterior" || photo.type === "yacht_interior"
      ),
      verificationStatus: producer.verificationStatus
    });
  } catch (error) {
    console.error("Error fetching yacht:", error);
    res.status(500).json({ message: "Error fetching yacht", error });
  }
});

// Update yacht details
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const [ownerId] = req.params.id.split("-");

    // Only allow producers to update their own yachts
    if (
      req.user?.userType !== "producer" || 
      req.user?.id !== parseInt(ownerId)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const producer = await db.query.users.findFirst({
      where: eq(users.id, parseInt(ownerId))
    });

    if (!producer) {
      return res.status(404).json({ message: "Producer not found" });
    }

    // Update the yacht details in the producer's profile
    const updatedProfile = {
      ...producer.producerProfile,
      yachtDetails: producer.producerProfile?.yachtDetails?.map(yacht => 
        yacht.name === req.body.name ? { ...yacht, ...req.body } : yacht
      )
    };

    const [updatedProducer] = await db
      .update(users)
      .set({
        producerProfile: updatedProfile,
        updatedAt: new Date()
      })
      .where(eq(users.id, parseInt(ownerId)))
      .returning();

    const updatedYacht = updatedProducer.producerProfile?.yachtDetails?.find(
      yacht => yacht.name === req.body.name
    );

    res.json({
      id: req.params.id,
      ownerId: updatedProducer.id,
      ownerName: updatedProducer.fullName,
      businessName: updatedProducer.businessName,
      ...updatedYacht,
      pricing: updatedProducer.availability?.pricing,
      media: updatedProducer.mediaGallery?.photos?.filter(
        photo => photo.type === "yacht_exterior" || photo.type === "yacht_interior"
      ),
      verificationStatus: updatedProducer.verificationStatus
    });
  } catch (error) {
    console.error("Error updating yacht:", error);
    res.status(500).json({ message: "Error updating yacht", error });
  }
});

export default router;