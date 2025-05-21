import Restaurant from "../models/restaurantModel.js";
import Joi from "joi";

//TODO: Remove  after project completion
import Admin from "../models/adminModel.js";

// validate restaurant data
const validateRestaurant = (restaurant) => {
  const schema = Joi.object({
    restaurantName: Joi.string().min(3).max(100).required(),
    ownerName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    location: Joi.string().min(3).max(200).required(),
    taxNumber: Joi.string().min(3).max(50).required(),
    address: Joi.string().min(10).max(200).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .allow(null),
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  });
  return schema.validate(restaurant);
};

// Add Restaurant by Admin
export const addRestaurantByAdmin = async (req, res) => {
  const adminId = req.user.id;
  const tradeLicense =
    req.files && req.files["tradeLicense"]
      ? req.files["tradeLicense"][0].path
      : null;
  const businessLicense =
    req.files && req.files["businessLicense"]
      ? req.files["businessLicense"][0].path
      : null;
  // Validate required fields
  const { error } = validateRestaurant(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const {
    restaurantName,
    ownerName,
    email,
    location,
    taxNumber,
    address,
    phone,
    lat,
    lng,
  } = req.body;
  try {
    // Check if admin already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ adminId });
    if (existingRestaurant) {
      return res
        .status(400)
        .json({ success: false, message: "Admin can only add one restaurant" });
    }
    const coordinates = {
      lat: lat,
      lng: lng,
    };
    // Create and save new restaurant
    const newRestaurant = new Restaurant({
      restaurantName,
      ownerName,
      email,
      location,
      taxNumber,
      tradeLicense,
      businessLicense,
      address,
      phone,
      coordinates,
      adminId,
    });
    const restaurant = await newRestaurant.save();
    //TODO: Remove  after project completion
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Verify admin profile
    admin.isVerified = true;
    await admin.save();
    return res.status(201).json({ success: true, result: restaurant });
  } catch (error) {
    console.error("Error from Admin Controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

// Update Restaurant by Admin
export const updateRestaurantByAdmin = async (req, res) => {
  const adminId = req.user.id;
  const restaurantId = req.params.id;
  const tradeLicense = req.files["tradeLicense"]
    ? req.files["tradeLicense"][0].path
    : null;
  const businessLicense = req.files["businessLicense"]
    ? req.files["businessLicense"][0].path
    : null;
  // Validate required fields
  const { error } = validateRestaurant(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const {
    restaurantName,
    ownerName,
    email,
    location,
    taxNumber,
    address,
    phone,
    lat,
    lng,
  } = req.body;

  try {
    // Find restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const coordinates = {
      lat: lat,
      lng: lng,
    };
    // Check authorization
    if (restaurant.adminId.toString() !== adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized to update" });
    }

    // Update and save restaurant
    Object.assign(restaurant, {
      restaurantName,
      ownerName,
      email,
      location,
      taxNumber,
      tradeLicense,
      businessLicense,
      address,
      phone,
      coordinates,
    });
    const updatedRestaurant = await restaurant.save();
    return res.status(200).json({ success: true, result: updatedRestaurant });
  } catch (error) {
    console.error("Error from Admin Controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

// Get Restaurant by Admin
export const getRestaurantByAdmin = async (req, res) => {
  const adminId = req.user.id;

  try {
    // Find restaurant by admin ID
    const restaurant = await Restaurant.findOne({ adminId });

    // Check if restaurant exists
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    return res.status(200).json({ success: true, result: restaurant });
  } catch (error) {
    console.error("Error from Admin Controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};
