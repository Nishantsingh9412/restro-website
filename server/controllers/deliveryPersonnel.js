import authDeliv from "../models/authDeliv.js";
import mongoose from "mongoose";

// Helper function to validate that all fields are present
const validateFields = (fields) => {
  return fields.every((field) => field);
};

// Helper function to handle errors and send a response
const handleError = (res, err, message = "Internal Server Error") => {
  console.error("Error from DeliveryPersonnel Controller:", err.message);
  return res.status(500).json({ success: false, message });
};

// Controller to create a new delivery personnel
export const createDeliveryPersonnel = async (req, res) => {
  const { name, country_code, phone, created_by } = req.body;
  // Validate required fields
  if (!validateFields([name, country_code, phone, created_by])) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Create a new delivery personnel
    const newDelBoy = await authDeliv.create({
      name,
      country_code,
      phone,
      created_by,
    });
    return res
      .status(201)
      .json({
        success: true,
        message: "Delivery Personnel Added",
        result: newDelBoy,
      });
  } catch (err) {
    return handleError(res, err, "Delivery Personnel not added");
  }
};

// Controller to get all delivery personnel
export const getDeliveryPersonnels = async (req, res) => {
  try {
    // Fetch all delivery personnel
    const allDelBoyz = await authDeliv.find();
    return res
      .status(200)
      .json({
        success: true,
        message: "All Delivery Personnel",
        result: allDelBoyz,
      });
  } catch (err) {
    return handleError(res, err, "No Delivery Personnel Found");
  }
};

// Controller to update a delivery personnel by ID
export const updateDeliveryPersonnel = async (req, res) => {
  const { id: _id } = req.params;
  const { name, country_code, phone } = req.body;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No Delivery Personnel with that id");
  }
  // Validate required fields
  if (!validateFields([name, country_code, phone])) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Update the delivery personnel
    const updatedDelBoy = await authDeliv.findByIdAndUpdate(
      _id,
      { name, country_code, phone },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Delivery Personnel Updated",
        result: updatedDelBoy,
      });
  } catch (err) {
    return handleError(res, err, "Delivery Personnel not updated");
  }
};

// Controller to get a single delivery personnel by ID
export const getDeliveryPersonnelSingle = async (req, res) => {
  const { id: _id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No Delivery Personnel with that id");
  }

  try {
    // Fetch the delivery personnel by ID
    const singleDelBoy = await authDeliv.findById(_id);
    return res
      .status(200)
      .json({
        success: true,
        message: "Delivery Personnel",
        result: singleDelBoy,
      });
  } catch (err) {
    return handleError(res, err, "No Delivery Personnel Found");
  }
};

// Controller to delete a delivery personnel by ID
export const deleteDeliveryPersonnel = async (req, res) => {
  const { id: _id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No Delivery Personnel with that id");
  }

  try {
    // Delete the delivery personnel by ID
    const delBoyToDelete = await authDeliv.findByIdAndDelete(_id);
    return res
      .status(200)
      .json({
        success: true,
        message: "Delivery Personnel Deleted",
        result: delBoyToDelete,
      });
  } catch (err) {
    return handleError(res, err, "Delivery Personnel not deleted");
  }
};
