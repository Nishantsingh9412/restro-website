import express from "express";
import { employeeMiddleware } from "../../middleware/authMiddleware.js";
import {
  getEmployee,
  getAllShiftByEmployee,
  updateEmployeeOnlineStatus,
  updateEmployeeProfilePic,
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

// get employee by id
router.get("/get-employee", employeeMiddleware, getEmployee);

// get all shifts of an employee
router.get("/get-all-shifts", employeeMiddleware, getAllShiftByEmployee);

// update employee profile picture
router.patch(
  "/update-profile-pic",
  employeeMiddleware,
  upload.single("profile_picture"),
  updateEmployeeProfilePic
);

export default router;
