// controllers/trackingController.js
import crypto from "crypto";
import mongoose from "mongoose";
import TrackingSchema from "../models/trackingSchema.js"; // your tracking schema

const TOKEN_BYTES = 16; // 128-bit token
const MAX_TOKEN_ATTEMPTS = 5;
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 60 minutes

/**
 * POST /tracking/generate
 * body: { orderId, delEmpId }
 * Only these two fields are required (per your requirement).
 */
export const generateTrackingToken = async (req, res) => {
  try {
    const { orderId, delEmpId } = req.body;

    // Validate presence
    if (!orderId || !delEmpId) {
      return res
        .status(400)
        .json({ error: "Order ID and Delivery Boy ID are required" });
    }

    // Validate ObjectId format (if you're using ObjectId)
    if (!mongoose.Types.ObjectId.isValid(delEmpId)) {
      return res.status(400).json({ error: "Invalid delEmpId format" });
    }

    // 1) Look for an existing active token for this order+driver
    const now = new Date();
    const existing = await TrackingSchema.findOne({
      orderId: orderId,
      driverId: delEmpId,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (existing) {
      const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
      const trackingUrl = clientUrl
        ? `${clientUrl}/track/${existing.token}`
        : `/track/${existing.token}`;
      return res.status(200).json({
        token: existing.token,
        trackingUrl,
        expiresAt: existing.expiresAt.toISOString(),
        reused: true,
      });
    }

    // 2) No active token: create a new one (retry on collision)
    let created = null;
    let attempts = 0;
    const expiresAt = new Date(Date.now() + DEFAULT_TTL_MS);

    while (!created && attempts < MAX_TOKEN_ATTEMPTS) {
      attempts += 1;
      const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
      try {
        created = await TrackingSchema.create({
          token,
          orderId: orderId,
          driverId: delEmpId,
          expiresAt,
        });
      } catch (err) {
        // Duplicate token collision -> retry with new token
        if (
          err &&
          err.code === 11000 &&
          err.keyPattern &&
          err.keyPattern.token
        ) {
          created = null;
          continue;
        }
        // Other DB errors: return 500
        console.error("Error creating tracking token:", err);
        return res
          .status(500)
          .json({ error: "Failed to create tracking token" });
      }
    }

    if (!created) {
      return res
        .status(500)
        .json({ error: "Unable to generate unique token, please try again" });
    }

    const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
    const trackingUrl = clientUrl
      ? `${clientUrl}/track/${created.token}`
      : `/track/${created.token}`;

    return res.status(201).json({
      token: created.token,
      trackingUrl,
      expiresAt: created.expiresAt.toISOString(),
      created: true,
    });
  } catch (err) {
    console.error("Unhandled error in generateTrackingToken:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
