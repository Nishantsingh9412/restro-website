import express from "express";
import { employeeMiddleware } from "../../middleware/authMiddleware.js";
import {
  updateEmployeeOnlineStatus,
  getAllShiftByEmployee,
} from "../../controllers/employees/commonController.js";

import { upload } from "../../middleware/fileupload.js";

const router = express.Router();

// update employee online status
router.put(
  "/update-online-status",
  employeeMiddleware,
  upload.single("live_photo"),
  updateEmployeeOnlineStatus
);

// get all shifts of an employee
router.get("/get-all-shifts", employeeMiddleware, getAllShiftByEmployee);

export default router;
