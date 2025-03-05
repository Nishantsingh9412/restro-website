import axios from "axios";
import mongoose from "mongoose";
import DeliveryOrder from "../models/deliveryOrder.js";
import Delivery from "../models/delivery.js";
import Notification from "../models/notification.js";
import DeliveryBoyModel from "../models/deliveryBoyModel.js";
import { notifyUser, sendDeliveryOffer } from "../utils/socket.js";
import { getRestaurantCoordinates } from "./employees/commonController.js";
import { onlineUsers } from "../server.js";

// Function to get coordinates from address using TomTom API
const getCoordinates = async (address) => {
  const apiKey = process.env.TOMTOM_API_KEY;
  try {
    const response = await axios.get(
      `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        address
      )}.json`,
      {
        params: {
          key: apiKey,
        },
      }
    );
    const results = response.data.results;
    if (results && results.length > 0) {
      const coordinates = {
        lat: results[0].position.lat,
        lng: results[0].position.lon,
      };
      return coordinates;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

// Function to get route data from TomTom API
const getRouteData = async (start, end) => {
  const apiKey = process.env.TOMTOM_API_KEY;
  try {
    const response = await axios.get(
      `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lng}:${end.lat},${end.lng}/json?key=${apiKey}`
    );
    const data = response.data;
    if (data.routes && data.routes[0]) {
      return {
        distance: data.routes[0].summary.lengthInMeters,
        duration: data.routes[0].summary.travelTimeInSeconds,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in getRouteData,", error);
    return null;
  }
};

// Controller to create a complete order
export const createDeliveryOrder = async (req, res) => {
  const { id, role, created_by } = req.user;
  const supplier = role === "admin" ? id : created_by;
  try {
    const {
      name,
      phoneNumber,
      paymentMethod,
      deliveryMethod,
      dropLocation,
      dropLocationName,
      address,
      address2,
      zip,
      noteFromCustomer,
      orderItems,
      totalPrice,
    } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !address || !totalPrice || !dropLocation) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }

    // Format order items
    const formattedOrderItems = orderItems.map((item) => ({
      item: new mongoose.Types.ObjectId(item._id),
      quantity: item.quantity,
      total: item.priceVal * item.quantity,
    }));

    // Generate unique order ID
    const orderId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      1000000 + Math.random() * 9000000
    )}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const pickupLocation = await getRestaurantCoordinates(supplier);
    // Create new complete order
    const newDeliveryOrder = await DeliveryOrder.create({
      orderId,
      name,
      phoneNumber,
      paymentMethod,
      deliveryMethod,
      dropLocation,
      dropLocationName,
      pickupLocation,
      address,
      address2,
      zip,
      noteFromCustomer,
      orderItems: formattedOrderItems,
      totalPrice,
      created_by: supplier,
    });

    if (newDeliveryOrder) {
      return res.status(201).json({
        success: true,
        message: "Order Added",
        result: newDeliveryOrder,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Order not added" });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error, ${err.message}`,
    });
  }
};

// Controller to get all complete orders by user ID
export const getDeliveryOrders = async (req, res) => {
  const { id, role, created_by } = req.user;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }
  try {
    const deliveryOrders = await DeliveryOrder.find({
      created_by: role === "admin" ? id : created_by,
    })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });

    // Add assigned delivery boy information to each order
    const finalOrders = await Promise.all(
      deliveryOrders.map(async (order) => {
        const assigned = await Delivery.findOne({
          orderId: order?.orderId,
        }).select("assignedTo completedAt");
        if (assigned) {
          const assignedTo = await DeliveryBoyModel.findById(
            assigned.assignedTo
          ).select("name");
          return {
            ...(order._doc || order),
            assignedTo,
            completedAt: assigned.completedAt,
          };
        } else return order._doc || order;
      })
    );

    return res
      .status(200)
      .json({ success: true, message: "All Orders", result: finalOrders });
  } catch (err) {
    console.log("Error from Order Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to allot order delivery to a delivery boy
export const allotOrderDelivery = async (req, res) => {
  const { id, role, created_by } = req.user;
  const { id: orderId } = req.params;
  const supplier = role === "admin" ? id : created_by;
  const { deliveryBoyId } = req.body;
  try {
    // Validate required fields
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid Id" });
    }

    if (!deliveryBoyId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    // Get order details
    const delOrder = await DeliveryOrder.findOne({ orderId: orderId });
    if (!delOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Get route info from pickup to delivery location
    const pickupLocation = {
      lat: delOrder.pickupLocation.lat,
      lng: delOrder.pickupLocation.lng,
    };
    const routeInfo = await getRouteData(pickupLocation, delOrder.dropLocation);
    if (routeInfo === null) {
      return res
        .status(500)
        .json({ success: false, message: "Error fetching route info" });
    }

    const defaultCountry = "Germany";

    const delivery = await Delivery.create({
      // supplier,
      // restaurantName: foundSupplier.name,
      orderId: orderId,
      assignedTo: deliveryBoyId,
      pickupLocation: delOrder.pickupLocation,
      deliveryLocation: delOrder.dropLocation,
      deliveryAddress: [
        delOrder.address,
        delOrder.address2,
        delOrder.zip,
        defaultCountry,
      ]
        .filter(Boolean)
        .join(", "),
      distance: routeInfo?.distance,
      estimatedTime: routeInfo?.duration,
      customerName: delOrder.name,
      customerContact: delOrder.phoneNumber,
      paymentType: delOrder.paymentMethod,
      created_by: supplier,
    });

    if (!delivery) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to allot Order Delivery" });
    } else {
      await sendDeliveryOffer(deliveryBoyId, delivery);
      const noti = await Notification.create({
        sender: supplier,
        receiver: deliveryBoyId,
        heading: "Delivery Task Received",
        body: `You have received a delivery task for order ${orderId}`,
      });

      if (noti) {
        await notifyUser(deliveryBoyId, noti);
      }
    }
    res.status(200).json({ success: true, message: "Order Allotted" });
  } catch (err) {
    console.log("Error from allotOrderDelivery Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to get a complete order by ID
export const getDeliveryOrderById = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    const completeOrderSingle = await DeliveryOrder.findById(_id);
    if (completeOrderSingle) {
      return res
        .status(200)
        .json({ success: true, message: "Order", result: completeOrderSingle });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
  } catch (err) {
    console.log("Error from Order Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to update a complete order by ID
export const updateDeliveryOrder = async (req, res) => {
  const { id: _id } = req.params;
  const { id, role, created_by } = req.user;
  const {
    name,
    phoneNumber,
    paymentMethod,
    deliveryMethod,
    address,
    address2,
    city,
    state,
    zip,
    noteFromCustomer,
    orderItems,
    totalPrice,
  } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    const updatedOrder = await DeliveryOrder.findByIdAndUpdate(
      { _id },
      {
        name,
        phoneNumber,
        paymentMethod,
        deliveryMethod,
        address,
        address2,
        city,
        state,
        zip,
        noteFromCustomer,
        orderItems,
        totalPrice,
        created_by: role === "admin" ? id : created_by,
      },
      { new: true }
    );
    if (updatedOrder) {
      return res.status(200).json({
        success: true,
        message: "Order Updated",
        result: updatedOrder,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not updated" });
    }
  } catch (err) {
    console.log("Error from Order Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to delete a complete order by ID
export const deleteDeliveryOrder = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    const deletedOrder = await DeliveryOrder.findByIdAndDelete(_id);
    if (deletedOrder) {
      return res.status(200).json({
        success: true,
        message: "Order Deleted",
        result: deletedOrder,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not deleted" });
    }
  } catch (err) {
    console.log("Error from Order Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getDistance = async (start, end) => {
  const url = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lng}:${end.lat},${end.lng}/json?key=${process.env.TOMTOM_API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.routes[0].summary.lengthInMeters / 1000; // Convert to km
  } catch (error) {
    console.error("Error calculating distance:", error);
    return Infinity;
  }
};

// Function to get the nearest drop location for a delivery boy
const getNearestDropLocation = async (deliveryBoyId, orderDropLocation) => {
  const assignedOrders = await Delivery.find({
    assignedTo: deliveryBoyId,
    // currentStatus: { $in: ["Accepted", "Picked up"] },
  });

  if (assignedOrders.length === 0) return null;

  let nearestLocation = null;
  let minDistance = Infinity;

  for (const order of assignedOrders) {
    // Get distance between order's delivery location and current order's drop location
    const distance = await getDistance(
      order.deliveryLocation,
      orderDropLocation
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestLocation = order.deliveryLocation;
    }
  }

  return nearestLocation
    ? { location: nearestLocation, distance: minDistance }
    : null;
};

// Function to get sorted delivery boys based on distance to current order's drop location
const getSortedDeliveryBoys = async (
  pickupLocation,
  orderDropLocation,
  supplier
) => {
  try {
    const onlineEmployees = Array.from(onlineUsers.keys());

    const availableDeliveryBoys = await DeliveryBoyModel.find({
      _id: { $in: onlineEmployees },
      is_online: true,
      created_by: supplier,
      status: "AVAILABLE",
    });
    if (availableDeliveryBoys.length === 0) {
      throw new Error("Delivery boys not available");
    }

    const deliveryBoyDistances = await Promise.all(
      availableDeliveryBoys.map(async (boy) => {
        // Get nearest drop location for the delivery
        const nearestDrop = await getNearestDropLocation(
          boy._id,
          orderDropLocation
        );
        // Get distance between delivery
        const location = nearestDrop ? nearestDrop.location : pickupLocation;
        const distance = nearestDrop
          ? nearestDrop.distance
          : await getDistance(pickupLocation, orderDropLocation);

        if (!location || !location.lat || !location.lng) return null;

        return { ...boy.toObject(), distance };
      })
    );

    const sortedDeliveryBoys = deliveryBoyDistances
      .filter((boy) => boy !== null)
      .sort((a, b) => a.distance - b.distance);

    return sortedDeliveryBoys;
  } catch (error) {
    console.error("Error getting sorted delivery boys:", error);
    throw error;
  }
};

// Express route to get sorted delivery boys
export const getOnlineDeliveryBoys = async (req, res) => {
  const { orderId } = req.params;
  const { id, role, created_by } = req.user;
  const supplier = role === "admin" ? id : created_by;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  if (orderId === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Order Id is required" });
  }

  // get order details
  const order = await DeliveryOrder.findOne({ orderId: orderId }).select(
    "dropLocation pickupLocation"
  );
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  // get delivery details of the order
  const pickupLocation = order.pickupLocation;
  const dropLocation = order.dropLocation;

  try {
    const sortedDeliveryBoys = await getSortedDeliveryBoys(
      pickupLocation,
      dropLocation,
      supplier
    );
    res.status(200).json({
      success: true,
      message:
        "Delivery Boys sorted based on distance to drop location fetched successfully",
      result: sortedDeliveryBoys,
    });
  } catch (error) {
    console.error("Error getting sorted delivery", error);
    res
      .status(500)
      .json({ message: "Failed to get delivery boys", error: error.message });
  }
};
