import express from "express";
import {
  updateUserProfilePic,
  getLoggedInUserData,
} from "../controllers/user.js";
import { upload } from "../middleware/fileupload.js";
import {
  adminMiddleware,
  employeeMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-user", adminMiddleware, getLoggedInUserData); // get user by id
router.patch(
  "/profile-pic-update",
  adminMiddleware,
  upload.single("profile_picture"),
  updateUserProfilePic
);

export default router;
