import deliveryBoy from "../models/deliveryBoyModel.js";
import Delivery from "../models/delivery.js";
import mongoose from "mongoose";
import { onlineUsers } from "../server.js";
import path from "path";
import fs from "fs";

// Helper function to handle errors
const handleError = (res, err, message = "Internal Server Error") => {
  console.error("Error from DeliveryPersonnel Controller:", err.message);
  return res.status(500).json({ success: false, message });
};

// Helper function to validate MongoDB ObjectId
const validateObjectId = (id, res, entity = "Entity") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(404)
      .json({ success: false, message: `No ${entity} with that id` });
    return false;
  }
  return true;
};

// update delivery personnels online status
export const updateDeliveryPersonnelOnlineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res, "Delivery Personnel")) return;

    const { isOnline } = req.body;
    if (isOnline === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "isOnline field is required" });
    }

    const updatedDelBoy = await deliveryBoy.findByIdAndUpdate(
      id,
      { isOnline },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Delivery Personnel Updated",
      result: updatedDelBoy,
    });
  } catch (err) {
    handleError(res, err, "Delivery Personnel not updated");
  }
};

// Invite delivery personnels to a delivery
export const inviteDeliveryPersonnels = async (req, res) => {
  try {
    const { deliveryId, userIds } = req.body;
    if (!deliveryId || !Array.isArray(userIds) || !userIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const delivery = await Delivery.findById(deliveryId);
    await sendDeliveryOffers(userIds, delivery);
    res.status(200).json({ success: true, message: "Delivery offers sent" });
  } catch (err) {
    handleError(res, err);
  }
};

// Get online delivery personnels by supplier
// Get online delivery personnels by supplier
export const getOnlineDeliveryPersonnelsBySupplier = async (req, res) => {
  try {
    // Get supplier ID from the request user object
    const supplierId = req.user.id;
    if (!supplierId) {
      return res
        .status(400)
        .json({ success: false, message: "Supplier ID is required" });
    }
    // Validate the supplier ID
    if (!validateObjectId(supplierId, res, "Supplier")) return;

    // Get the list of online users
    const online = Array.from(onlineUsers.keys());
    if (!online.length) {
      return res.status(200).json({
        success: true,
        message: "No online delivery personnels found",
        result: [],
      });
    }

    // Find online delivery personnels created by the supplier
    const onlineDeliveryPersonnels = await deliveryBoy.find({
      _id: { $in: online },
      created_by: supplierId,
      is_online: true,
    });

    if (!onlineDeliveryPersonnels.length) {
      return res.status(200).json({
        success: true,
        message: "No online delivery personnels found",
        result: [],
      });
    }

    // Get the count of completed deliveries for each online delivery personnel
    const onlineWithCompletedCount = await Promise.all(
      onlineDeliveryPersonnels.map(async (guy) => {
        const count = await Delivery.countDocuments({
          currentStatus: "Completed",
          assignedTo: guy._id,
        });
        return { ...guy._doc, completedCount: count };
      })
    );

    // Respond with the list of online delivery personnels and their completed delivery count
    res.status(200).json({
      success: true,
      message: "Online Delivery Personnels",
      result: onlineWithCompletedCount,
    });
  } catch (err) {
    // Handle any errors that occur
    handleError(res, err);
  }
};

// Create a new delivery personnel
export const createDeliveryPersonnel = async (req, res) => {
  try {
    const { name, country_code, phone, created_by } = req.body;
    if (!name || !country_code || !phone || !created_by) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newDelBoy = await deliveryBoy.create({
      name,
      country_code,
      phone,
      created_by,
    });
    res.status(201).json({
      success: true,
      message: "Delivery Personnel Added",
      result: newDelBoy,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Get all delivery personnels
export const getDeliveryPersonnels = async (req, res) => {
  try {
    const allDelBoyz = await deliveryBoy.find();
    res.status(200).json({
      success: true,
      message: "All Delivery Personnel",
      result: allDelBoyz,
    });
  } catch (err) {
    handleError(res, err, "No Delivery Personnel Found");
  }
};

// Update a delivery personnel
export const updateDeliveryPersonnel = async (req, res) => {
  const { id: _id } = req.params;
   
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Delivery Personnel with that id");
  if (!req.body)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });

  try {
    const updatedDelBoy = await deliveryBoy.findByIdAndUpdate(
      _id,
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
        timestamps: { createdAt: false, updatedAt: true },
      }
    );
    if (updatedDelBoy) {
      return res.status(200).json({
        success: true,
        message: "Delivery Personnel Updated",
        result: updatedDelBoy,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Delivery Personnel not updated" });
    }
  } catch (err) {
    console.log("Error from DeliveryPersonnel Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get a single delivery personnel by ID
export const getDeliveryPersonnelSingle = async (req, res) => {
  const { id: _id } = req.params;
  if (!validateObjectId(_id, res, "Delivery Personnel")) return;

  try {
    const singleDelBoy = await deliveryBoy.findById(_id).populate("created_by");
    res.status(200).json({
      success: true,
      message: "Delivery Personnel",
      result: singleDelBoy,
    });
  } catch (err) {
    handleError(res, err, "No Delivery Personnel Found");
  }
};

// Delete a delivery personnel by ID
export const deleteDeliveryPersonnel = async (req, res) => {
  const { id: _id } = req.params;

  if (!validateObjectId(_id, res, "Delivery Personnel")) return;

  try {
    const delBoyToDelete = await deliveryBoy.findByIdAndDelete(_id);
    res.status(200).json({
      success: true,
      message: "Delivery Personnel Deleted",
      result: delBoyToDelete,
    });
  } catch (err) {
    handleError(res, err, "Delivery Personnel not deleted");
  }
};

// Update delivery boy odometer reading
export const updateDeliveryBoyOdometerReading = async (req, res) => {
  try {
    const id = req.user.id;
    // Validate the delivery personnel ID
    if (!validateObjectId(id, res, "Delivery Personnel")) return;

    const { odometer_reading } = req.body;
    const odometer_photo = req.file ? req.file.filename : null;

    // Check if both odometer reading and photo are provided
    if (!odometer_reading || !odometer_photo) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find the delivery personnel by ID
    const delBoy = await deliveryBoy.findById(id);

    if (!delBoy) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery Personnel not found" });
    }

    // Delete old odometer photo if it exists
    if (delBoy.odometer_photo) {
      const oldOdometerPhotoPath = path.join("uploads/", delBoy.odometer_photo);
      if (fs.existsSync(oldOdometerPhotoPath)) {
        fs.unlink(oldOdometerPhotoPath, (err) => {
          if (err) {
            console.error("Error deleting old odometer photo:", err);
          }
        });
      }
    }

    // Update delivery personnel's odometer reading and photo
    delBoy.odometer_reading = odometer_reading;
    delBoy.odometer_photo = odometer_photo;
    await delBoy.save();

    res.status(200).json({
      success: true,
      message: "Delivery Personnel Updated",
      result: delBoy,
    });
  } catch (err) {
    handleError(res, err, "Delivery Personnel not updated");
  }
};
