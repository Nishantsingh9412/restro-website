//TODO:Delete after project completion
import express from "express";
import {
  getAllAdmins,
  deleteAdmin,
  getLoggedInAdminData,
  updateAdminProfilePic,
} from "../controllers/adminController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/fileupload.js";

const router = express.Router();

// get all admins
router.get("/get-all-admins", getAllAdmins);

// delete admin
router.delete("/delete-admin/:id", deleteAdmin);

// get logged in admin data
router.get("/get-admin", adminMiddleware, getLoggedInAdminData);

// update admin profile picture
router.patch(
  "/profile-pic-update",
  adminMiddleware,
  upload.single("profile_picture"),
  updateAdminProfilePic
);

export default router;
