import express from "express";
import {
  updateUserProfilePic,
  getLoggedInUserData,
} from "../controllers/user.js";
import { upload } from "../middleware/fileupload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-user", authMiddleware, getLoggedInUserData); // get user by id
router.patch(
  "/profile-pic-update",
  authMiddleware,
  upload.single("profile_picture"),
  updateUserProfilePic
);

export default router;
