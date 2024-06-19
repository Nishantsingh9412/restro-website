import fs from 'fs'
import path from 'path';
import mongoose from "mongoose";
import Auth from "../models/auth.js";

export const singleUserData = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid QR Item ID" })
    }
    try {
        const user = await Auth.findById(_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, result: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error });
    }
}

export const updateUserProfilePic = async (req, res) => {
    const { id: _id } = req.params;
    const profile_picture = req.file ? req.file.filename : null;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid User ID" });
    }
    if (!profile_picture) {
        return res.status(400).json({ success: false, message: "Profile picture is required" });
    }

    try {
        // Retrieving the current user to get the old profile picture
        const user = await Auth.findById(_id);
        if (user && user.profile_picture) {
            // Constructing the path to the old profile picture
            const oldProfilePicPath = path.join('uploads/', user.profile_picture); // Adjusting the path as necessary
            // Checking if the file exists before attempting to delete
            if (fs.existsSync(oldProfilePicPath)) {
                fs.unlink(oldProfilePicPath, (err) => {
                    if (err) {
                        console.error("Failed to delete old profile picture:", err);
                    }
                });
            }
        }
        // Update the user with the new profile picture
        const updatedUser = await Auth.findByIdAndUpdate(_id, { profile_picture: profile_picture }, { new: true });
        return res.status(200).json({ success: true, result: updatedUser });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: err });
    }
};