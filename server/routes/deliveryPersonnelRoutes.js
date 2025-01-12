import express from "express";
import {
  createDeliveryPersonnel,
  deleteDeliveryPersonnel,
  getDeliveryPersonnelSingle,
  getDeliveryPersonnels,
  getOnlineDeliveryPersonnelsBySupplier,
  updateDeliveryPersonnel,
  updateDeliveryPersonnelOnlineStatus,
  updateDeliveryBoyOdometerReading,
} from "../controllers/deliveryPersonnel.js";
import { upload } from "../middleware/fileupload.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-all", getDeliveryPersonnels);
router.get(
  "/get-by-supplier",
  accessMiddleware("Delivery-Tracking"),
  getOnlineDeliveryPersonnelsBySupplier
);
router.post("/create-one", createDeliveryPersonnel);
router.patch("/update-del-person/:id", updateDeliveryPersonnel);
router.patch("/change-online-status/:id", updateDeliveryPersonnelOnlineStatus);
router.get("/get-single/:id", getDeliveryPersonnelSingle);
router.delete("/delete-single/:id", deleteDeliveryPersonnel);

router.put(
  "/update-odometer",
  accessMiddleware(),
  upload.single("odometer_photo"),
  updateDeliveryBoyOdometerReading
);

export default router;
