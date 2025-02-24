import Employee from "../../models/employeeModel.js";
import Shift from "../../models/employeeShift.js";
import Notification from "../../models/notification.js";
import fs from "fs";
import path from "path";
import Joi from "joi";
import Restaurant from "../../models/restaurantModel.js";

const schema = Joi.object({
  is_online: Joi.boolean().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  live_photo: Joi.string().optional(),
  adminId: Joi.string().required(),
});

// Define restaurant's fixed coordinates
// const RESTAURANT_COORDINATES = {
//   latitude: 25.6183987, // Replace with actual restaurant latitude
//   longitude: 85.1550559, // Replace with actual restaurant longitude
// };

// Helper Function to get the restaurant's coordinates
export const getRestaurantCoordinates = async (adminId) => {
  try {
    const restaurant = await Restaurant.findOne({ adminId });
    if (!restaurant) {
      return null;
    }
    return restaurant.coordinates;
  } catch (error) {
    console.error("Error getting restaurant coordinates:", error);
    return null;
  }
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
  const id = req.user.id;
  const { is_online, latitude, longitude, adminId } = req.body;
  const live_photo = req.file ? req.file.filename : null;
  const status = is_online === "true" ? true : false;
  // Check if employee ID is provided
  if (!id) return res.status(400).json({ message: "Employee ID is required" });

  if (status === false) {
    try {
      const employee = await Employee.findById(id);
      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      employee.is_online = status;
      await employee.save();
      return res.status(200).json({
        success: true,
        message: "Employee status updated successfully",
        is_online: employee.is_online,
        result: employee,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (status === true && (!latitude || !longitude)) {
    return res
      .status(400)
      .json({ message: "Location is required to set status to online" });
  }

  if (!live_photo)
    return res.status(400).json({ message: "Live Photo is required" });

  try {
    const employee = await Employee.findById(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    // Get restaurant coordinates
    const restaurantCoordinates = await getRestaurantCoordinates(adminId);
    // Check if restaurant coordinates are available
    if (!restaurantCoordinates) {
      return res.status(404).json({ message: "Restaurant not available" });
    }
    // Calculate distance between employee and restaurant
    if (status === true && restaurantCoordinates) {
      const distance = getDistanceFromLatLonInMeters(
        restaurantCoordinates?.lat,
        restaurantCoordinates?.lng,
        latitude,
        longitude
      );
      if (distance < 100) {
        return res.status(403).json({
          message:
            "You must be within 100 meters of the restaurant to go online",
        });
      }
    }
    // Update employee status and live photo
    employee.is_online = status;
    if (employee.live_photo) {
      const oldLivePhotoPath = path.join("uploads/", employee.live_photo);
      if (fs.existsSync(oldLivePhotoPath)) {
        fs.unlink(oldLivePhotoPath, (err) => {
          if (err) console.error("Error deleting old live photo:", err);
        });
      }
    }
    // Save new live photo
    employee.live_photo = live_photo;
    await employee.save();
    res.status(200).json({
      message: "Employee status updated successfully",
      is_online: employee.is_online,
      result: employee,
    });
  } catch (error) {
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
    if (!shifts) {
      return res
        .status(404)
        .json({ success: false, message: "No shifts found" });
    }

    // Send success response with shifts data
    res.status(200).json({ sucess: true, result: shifts });
  } catch (error) {
    // Handle invalid employee ID error
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }
    // Handle other errors
    res.status(500).json({ message: error.message });
  }
};

export const getEmployee = async (req, res) => {
  const id = req.user.id; // Extract employee ID from request user object

  // Check if employee ID is provided
  if (!id) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  try {
    // Find employee by ID
    const employee = await Employee.findById(id);

    // Check if employee is found
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Send success response with employee data
    res.status(200).json({ success: true, result: employee });
  } catch (error) {
    // Handle invalid employee ID error
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }
    // Handle other errors
    res.status(500).json({ message: error.message });
  }
};

// Update employee profile picture
export const updateEmployeeProfilePic = async (req, res) => {
  const id = req.user.id; // Extract employee ID from request user object
  const profile_picture = req.file ? req.file.filename : null; // Extract profile picture filename if provided

  // Check if employee ID is provided
  if (!id) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  // Check if profile picture is provided
  if (!profile_picture) {
    return res.status(400).json({ message: "Profile picture is required" });
  }

  try {
    // Find employee by ID
    const employee = await Employee.findById(id);

    // Check if employee is found
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete old profile picture if it exists
    if (employee.profile_picture) {
      const oldProfilePicPath = path.join("uploads/", employee.profile_picture);
      if (fs.existsSync(oldProfilePicPath)) {
        fs.unlink(oldProfilePicPath, (err) => {
          if (err) {
            console.error("Error deleting old profile picture:", err);
          }
        });
      }
    }

    // Update employee's profile picture
    employee.profile_picture = profile_picture;
    await employee.save(); // Save changes to the database

    // Send success response
    res.status(200).json({
      message: "Profile picture updated successfully",
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

export const getNotificationByEmployee = async (req, res) => {
  const id = req.user.id;
  try {
    // Validate employee ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Employee ID" });
    }
    // Fetch notifications for the employee
    const notifications = await Notification.find({ receiver: id }).sort({
      createdAt: -1,
    });
    if (!notifications.length) {
      return res.status(200).json({
        success: false,
        message: "No notifications found for this employee",
      });
    }
    // Return notifications
    return res.status(200).json({
      success: true,
      message: "Notifications retrieved",
      result: notifications,
    });
  } catch (err) {
    console.error("Error from getNotificationByEmployee Controller:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
