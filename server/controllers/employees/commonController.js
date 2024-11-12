import Employee from "../../models/employeeModel.js";
import Shift from "../../models/employeeShift.js";
import fs from "fs";
import path from "path";
import Joi from "joi";

const schema = Joi.object({
  status: Joi.boolean().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

// Define restaurant's fixed coordinates
const RESTAURANT_COORDINATES = {
  latitude: 24.2251279, // Replace with actual restaurant latitude
  longitude: 86.259756, // Replace with actual restaurant longitude
};

// Helper function to calculate distance between two coordinates using the Haversine formula
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

// Update the status of employee to online or offline based on location
export const updateEmployeeOnlineStatus = async (req, res) => {
  const id = req.user.id; // Extract employee ID from request parameters
  const { status, latitude, longitude } = req.body; // Extract status and location from request body
  const live_photo = req.file ? req.file.filename : null; // Extract live photo filename if provided

  // Check if employee ID is provided
  if (!id) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  // Validate request body against schema
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if location is provided when setting status to online
  if (status === true && (!latitude || !longitude)) {
    return res
      .status(400)
      .json({ message: "Location is required to set status to online" });
  }

  // Check if live photo is provided
  if (!live_photo) {
    return res.status(400).json({ message: "Live Photo is required" });
  }

  try {
    // Find employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // If setting status to online, check if employee is within 100 meters of the restaurant
    if (status === true) {
      const distance = getDistanceFromLatLonInMeters(
        RESTAURANT_COORDINATES.latitude,
        RESTAURANT_COORDINATES.longitude,
        latitude,
        longitude
      );

      if (distance > 100) {
        return res.status(403).json({
          message:
            "You must be within 100 meters of the restaurant to go online",
        });
      }
    }

    // Update employee's online status
    employee.is_online = status;

    // Delete old live photo if it exists
    if (employee.live_photo) {
      const oldLivePhotoPath = path.join("uploads/", employee.live_photo);
      if (fs.existsSync(oldLivePhotoPath)) {
        fs.unlink(oldLivePhotoPath, (err) => {
          if (err) {
            console.error("Error deleting old profile picture:", err);
          }
        });
      }
    }

    // Update employee's live photo
    employee.live_photo = live_photo;
    await employee.save(); // Save changes to the database

    // Send success response
    res.status(200).json({
      message: "Employee status updated successfully",
      is_online: employee.is_online,
      result: employee,
    });
  } catch (error) {
    // Handle invalid employee ID error
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }
    // Handle other errors
    res.status(500).json({ message: error.message });
  }
};


// get all working shift based on the employee
export const getAllShiftByEmployee = async (req, res) => {
  const empId = req.user.id; // Extract employee ID from request user object

  // Check if employee ID is provided
  if (!empId) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  try {
    // Find shifts by employee ID
    const shifts = await Shift.find({ employeeId: empId });

    // Check if no shifts are found
    if (shifts.length === 0) {
      return res.status(404).json({ message: "No shifts found" });
    }

    // Send success response with shifts data
    res.status(200).json(shifts);
  } catch (error) {
    // Handle invalid employee ID error
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }
    // Handle other errors
    res.status(500).json({ message: error.message });
  }
};
