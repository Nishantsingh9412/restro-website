import express from "express";
import { accessMiddleware } from "../../middleware/authMiddleware.js";
import {
  getEmployee,
  getAllShiftByEmployee,
  updateEmployeeOnlineStatus,
  updateEmployeeProfilePic,
  updateEmployeeProfile,
} from "../../controllers/employees/commonController.js";

import { upload } from "../../middleware/fileupload.js";

const router = express.Router();

// update employee online status
router.put(
  "/update-online-status",
  accessMiddleware(),
  upload.single("live_photo"),
  updateEmployeeOnlineStatus
);

// get employee by id
router.get("/get-employee", accessMiddleware(), getEmployee);

// get all shifts of an employee
router.get("/get-all-shifts", accessMiddleware(), getAllShiftByEmployee);

// update employee profile picture
router.patch(
  "/update-profile-pic",
  accessMiddleware(),
  upload.single("profile_picture"),
  updateEmployeeProfilePic
);

// update employee profile
router.patch(
  "/update-profile-details",
  accessMiddleware(),
  updateEmployeeProfile
);

export default router;
