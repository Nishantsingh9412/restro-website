import Admin from "../models/adminModel.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    // Fetch all admins from the database
    const admins = await Admin.find();
    if (admins.length === 0) {
      // If no admins found, return 404 status
      return res.status(404).json({ message: "No admins found" });
    }
    // Return the list of admins with 200 status
    res.status(200).json(admins);
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: error.message });
  }
};

// Delete an admin by ID
export const deleteAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      // If no ID is provided, return 400 status
      return res.status(400).json({ message: "Admin ID is required" });
    }
    // Find and delete the admin by ID
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      // If admin not found, return 404 status
      return res.status(404).json({ message: "Admin not found" });
    }
    // Return success message with 200 status
    res.status(200).json({ message: "Admin deleted successfully", res: admin });
  } catch (error) {
    if (error.kind === "ObjectId") {
      // Handle invalid ObjectId error
      return res.status(400).json({ message: "Invalid Admin ID" });
    }
    // Handle any server errors
    res.status(500).json({ message: error.message });
  }
};

// Get logged in admin data
export const getAdmin = async (req, res) => {
  const _id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    // If ID is not valid, return 400 status
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  try {
    // Find admin by ID
    const admin = await Admin.findById(_id).select("-password -__v ");
    if (!admin) {
      // If admin not found, return 404 status
      return res.status(404).json({ message: "Admin not found" });
    }
    // Return admin data with 200 status
    return res.status(200).json({ sucess: true, result: admin });
  } catch (error) {
    // Handle any server errors
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

// Update admin profile picture
export const updateAdminProfilePic = async (req, res) => {
  const _id = req.user.id;
  const profile_picture = req.file ? req.file.filename : null;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    // If ID is not valid, return 400 status
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }
  if (!profile_picture) {
    // If no profile picture is provided, return 400 status
    return res
      .status(400)
      .json({ success: false, message: "Profile picture is required" });
  }
  try {
    // Find admin by ID and exclude password and __v fields
    const admin = await Admin.findById(_id).select("-password -__v ");
    if (!admin) {
      // If admin not found, return 404 status
      return res.status(404).json({ message: "Admin not found" });
    }
    if (admin.profile_picture) {
      // If admin already has a profile picture, delete the old one
      const oldProfilePicPath = path.join("uploads/", admin.profile_picture);
      if (fs.existsSync(oldProfilePicPath)) {
        fs.unlink(oldProfilePicPath, (err) => {
          if (err) {
            console.error("Error deleting old profile picture:", err);
          }
        });
      }
    }
    // Update admin's profile picture
    admin.profile_picture = profile_picture;
    const updatedAdmin = await admin.save();
    // Return updated admin data with 200 status
    return res.status(200).json({ success: true, result: updatedAdmin });
  } catch (error) {
    // Handle any server errors
    console.log("Error from Admin Controller : ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};
