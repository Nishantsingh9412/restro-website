import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  updateEmployeeOnlineStatus,
  getAllShiftByEmployee,
} from "../controllers/employees/commonController.js";

import { upload } from "../middleware/fileupload.js";

const router = express.Router();

// update employee online status
router.put(
  "/update-online-status/:id",
  //   authMiddleware,
  upload.single("live_photo"),
  updateEmployeeOnlineStatus
);

// get all shifts of an employee
router.get("/get-all-shifts", authMiddleware, getAllShiftByEmployee);

export default router;
