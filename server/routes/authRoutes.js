import express from "express";
import passport from "passport";

// Importing the admin controllers
import {
  signUpAdminController,
  loginAdminController,
  loginEmployeeController
} from "../controllers/authController.js";
import { upload } from "../middleware/fileupload.js";

// Create a new router instance
const router = express.Router();

// Route for admin signup
router.post("/signup", upload.single("profile_picture"), signUpAdminController);

// Route for admin login
router.post("/login", loginAdminController);

// router to login employee
router.post("/login-employee", loginEmployeeController);

// Export the router to be used in other parts of the application
export default router;
