import express from "express";
import {
  createDeliveryPersonnel,
  deleteDeliveryPersonnel,
  getDeliveryPersonnelSingle,
  getDeliveryPersonnels,
  // getOnlineEmployeesByRole,
  updateDeliveryPersonnel,
  updateDeliveryPersonnelOnlineStatus,
  updateDeliveryBoyOdometerReading,
  getOnlineDeliveryPersonnelsBySupplier,
  toggleDeliveryBoyAvailability,
} from "../controllers/deliveryPersonnel.js";
import { upload } from "../middleware/fileupload.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-all", getDeliveryPersonnels);
router.get(
  "/get-by-supplier/:type",
  accessMiddleware("Delivery-Tracking" || "Food-And-Drinks"),
  getOnlineDeliveryPersonnelsBySupplier
);
router.patch(
  "/toggle-availability",
  accessMiddleware(),
  toggleDeliveryBoyAvailability
);
router.put(
  "/update-odometer",
  accessMiddleware(),
  upload.single("odometer_photo"),
  updateDeliveryBoyOdometerReading
);
router.post("/create-one", createDeliveryPersonnel);
router.patch("/update-del-person/:id", updateDeliveryPersonnel);
router.patch("/change-online-status/:id", updateDeliveryPersonnelOnlineStatus);
router.get("/get-single/:id", getDeliveryPersonnelSingle);
router.delete("/delete-single/:id", deleteDeliveryPersonnel);

export default router;
