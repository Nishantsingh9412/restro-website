import Restaurant from "../models/restaurantModel.js";
import Joi from "joi";

//TODO: Remove  after project completion
import Admin from "../models/adminModel.js";

// validate restaurant data
const validateRestaurant = (restaurant) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required().allow(null),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
    }).required(),
  });
  return schema.validate(restaurant);
};

// Add Restaurant by Admin
export const addRestaurantByAdmin = async (req, res) => {
  const adminId = req.user.id;
  // Validate required fields
  const { error } = validateRestaurant(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const { name, address, phone, coordinates } = req.body;
  try {
    // Check if admin already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ adminId });
    if (existingRestaurant) {
      return res
        .status(400)
        .json({ success: false, message: "Admin can only add one restaurant" });
    }

    // Create and save new restaurant
    const newRestaurant = new Restaurant({
      name,
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

  // Validate required fields
  const { error } = validateRestaurant(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const { name, address, phone, coordinates } = req.body;

  try {
    // Find restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check authorization
    if (restaurant.adminId.toString() !== adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized to update" });
    }

    // Update and save restaurant
    Object.assign(restaurant, { name, address, phone, coordinates });
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
