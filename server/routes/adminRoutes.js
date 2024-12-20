import express from "express";
import {
  getAllAdmins,
  deleteAdmin,
  getAdmin,
  updateAdminProfilePic,
} from "../controllers/adminController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/fileupload.js";
import {
  addRestaurantByAdmin,
  updateRestaurantByAdmin,
} from "../controllers/restaurantController.js";

const router = express.Router();

// get all admins
router.get("/get-all-admins", getAllAdmins);

// delete admin
router.delete("/delete-admin/:id", deleteAdmin);

// get logged in admin data
router.get("/get-admin", adminMiddleware, getAdmin);

// update admin profile picture
router.patch(
  "/update-profile-pic",
  adminMiddleware,
  upload.single("profile_picture"),
  updateAdminProfilePic
);

// add restaurant details
router.post("/add-restaurant", adminMiddleware, addRestaurantByAdmin);

// update restaurant details
router.patch("/update-restaurant", adminMiddleware, updateRestaurantByAdmin);

export default router;
