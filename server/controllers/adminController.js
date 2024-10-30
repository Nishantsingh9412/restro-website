import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import ShortUniqueId from "short-unique-id";
import handleApiCall from "../utils/utils.js";
import Joi from "joi";
import Admin from "../models/adminModel.js";
import Employee from "../models/employee.js";

// Define validation schema using Joi
const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  profile_pic: Joi.string().uri().optional().allow(""),
});

// Authenticate user using Google OAuth
export const authenticateUser = (req, res) => {
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })(req, res);
};

// Handle authentication failure
export const authFailed = (req, res) => {
  return res
    .status(401)
    .json({ success: false, message: "User Authentication Failed" });
};

// Handle authentication success
export const authSuccess = (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "User Authenticated",
      user: req.user,
    });
  } else {
    return res
      .status(403)
      .json({ success: false, message: "User not authenticated" });
  }
};

// Logout user and redirect to client URL
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.redirect(process.env.CLIENT_URL);
  });
};

// Create a new admin
export const signUpAdminController = async (req, res) => {
  const { name, email, password, profile_picture } = req.body;
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const uid = new ShortUniqueId();
    const uniqueId = uid.rnd(10);
    const newAdmin = await Admin.create({
      username: name,
      email,
      password: hashedPassword,
      profile_picture,
      uniqueId,
    });
    if (!newAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not created" });
    }
    const token = jwt.sign(
      { email: newAdmin.email, id: newAdmin._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(201).json({
      success: true,
      message: "Admin Created",
      result: newAdmin,
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login admin
export const loginAdminController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({ success: true, result: admin, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
