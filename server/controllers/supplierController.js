import mongoose from "mongoose";
import supplier from "../models/supplier.js";
import Joi from "joi";

// Helper function to handle error responses
const handleErrorResponse = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// Helper function to handle success responses
const handleSuccessResponse = (res, status, message, result = null) => {
  return res.status(status).json({ success: true, message, result });
};

// Joi validation schemas
const supplierSchema = Joi.object({
  name: Joi.string().required(),
  pic: Joi.string().uri().optional(),
  items: Joi.array().items(Joi.string()).required(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  countryCode: Joi.string().optional(),
  location: Joi.string().optional(),
  created_by: Joi.string().required(),
});

// Controller to add a new supplier
export const addSupplier = async (req, res) => {
  try {
    const { error, value } = supplierSchema.validate(req.body);
    if (error) {
      return handleErrorResponse(res, 400, error.details[0].message);
    }

    const newSupplier = await supplier.create(value);

    if (!newSupplier) {
      return handleErrorResponse(res, 400, "Error in creating supplier");
    }

    return handleSuccessResponse(
      res,
      200,
      "Supplier created successfully",
      newSupplier
    );
  } catch (error) {
    console.log("Error in AddSupplier", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Controller to get all suppliers created by a specific user
export const getSupplier = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return handleErrorResponse(res, 400, "Invalid User Id");
  }

  try {
    const allSuppliers = await supplier.find({ created_by: _id });

    if (!allSuppliers.length) {
      return handleErrorResponse(res, 200, "No Suppliers Found");
    }

    return handleSuccessResponse(res, 200, "All Suppliers", allSuppliers);
  } catch (err) {
    console.log("Error in getSupplier", err.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Controller to get a single supplier by ID
export const getSingleSupplier = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return handleErrorResponse(res, 400, "Invalid Supplier Id");
  }

  try {
    const singleSupplier = await supplier.findById(_id);

    if (!singleSupplier) {
      return handleErrorResponse(res, 400, "No Supplier Found");
    }

    return handleSuccessResponse(res, 200, "Single Supplier", singleSupplier);
  } catch (error) {
    console.log("Error in getSingleSupplier", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Controller to update a supplier by ID
export const updateSupplier = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return handleErrorResponse(res, 400, "Invalid Supplier Id");
  }

  const { error, value } = supplierSchema.validate(req.body, {
    allowUnknown: true,
  });
  if (error) {
    return handleErrorResponse(res, 400, error.details[0].message);
  }

  try {
    const updatedSupplier = await supplier.findByIdAndUpdate(_id, value, {
      new: true,
    });

    if (!updatedSupplier) {
      return handleErrorResponse(res, 400, "Error in Updating Supplier");
    }

    return handleSuccessResponse(
      res,
      200,
      "Supplier Updated Successfully",
      updatedSupplier
    );
  } catch (error) {
    console.log("Error in UpdateSupplier", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Controller to delete a supplier by ID
export const deleteSupplier = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return handleErrorResponse(res, 400, "Invalid Supplier Id");
  }

  try {
    const removedSupplier = await supplier.findByIdAndDelete(_id);

    if (!removedSupplier) {
      return handleErrorResponse(res, 400, "Error in Deleting Supplier");
    }

    return handleSuccessResponse(res, 200, "Supplier Deleted Successfully");
  } catch (error) {
    console.log("Error in deleteSupplier", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};
