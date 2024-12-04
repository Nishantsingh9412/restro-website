import mongoose from "mongoose";
import completeOrder from "../models/completeOrder.js";
import delivery from "../models/delivery.js";
import Delivery from "../models/delivery.js";
import DeliverBoy from "../models/deliveryBoyModel.js";
import Admin from "../models/adminModel.js";
import Notification from "../models/notification.js";
import { notifyUser, sendDeliveryOffer } from "../utils/socket.js";
import axios from "axios";
import deliveryBoyModel from "../models/deliveryBoyModel.js";

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

// Controller to create a complete order
export const createCompleteOrder = async (req, res) => {
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
      city,
      state,
      zip,
      noteFromCustomer,
      orderItems,
      totalPrice,
      created_by,
    } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !address || !totalPrice || !dropLocation) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    if (!created_by) {
      return res
        .status(401)
        .json({ success: false, message: "Session expired login again" });
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

    // Get coordinates for the address
    const coords = await getCoordinates(
      [address, address2, city, state, "IN", zip].filter(Boolean).join(", ")
    );
    if (!coords?.lat || !coords?.lng)
      return res
        .status(500)
        .json({ success: false, message: "Error fetching location" });

    // Create new complete order
    const newCompleteOrder = await completeOrder.create({
      name,
      phoneNumber,
      paymentMethod,
      deliveryMethod,
      dropLocation,
      dropLocationName,
      lat: coords.lat,
      lng: coords.lng,
      address,
      address2,
      city,
      state,
      zip,
      noteFromCustomer,
      orderItems: formattedOrderItems,
      totalPrice,
      created_by,
      orderId,
    });

    if (newCompleteOrder) {
      return res.status(201).json({
        success: true,
        message: "Order Added",
        result: newCompleteOrder,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Order not added" });
    }
  } catch (err) {
    console.log("Error from Order Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to get all complete orders by user ID
export const getCompleteOrders = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }
  try {
    const completeOrders = await completeOrder
      .find({ created_by: _id })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });

    // Add assigned delivery boy information to each order
    const finalOrders = await Promise.all(
      completeOrders.map(async (order) => {
        const assigned = await delivery
          .findOne({ orderId: order?.orderId })
          .select("assignedTo");
        if (assigned) {
          const assignedTo = await deliveryBoyModel
            .findById(assigned.assignedTo)
            .select("name");
          return { ...(order._doc || order), assignedTo };
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

// Controller to allot order delivery to a delivery boy
export const allotOrderDelivery = async (req, res) => {
  const { id } = req.params;
  const supplier = req.user.id;
  const { deliveryBoyId } = req.body;
  try {
    if (!supplier || !deliveryBoyId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    const order = await completeOrder.findOne({ orderId: id });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const foundSupplier = await Admin.findById(supplier);
    if (!foundSupplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });

    const routeInfo = await getRouteData(order.dropLocation, {
      lat: order.lat,
      lng: order.lng,
    });

    const defaultCountry = "India";

    const delivery = await Delivery.create({
      orderId: id,
      supplier,
      assignedTo: deliveryBoyId,
      dropLocation: order.dropLocation,
      deliveryLocation: { lat: order.lat, lng: order.lng },
      deliveryAddress: [
        order.address,
        order.address2,
        order.city,
        order.state,
        defaultCountry,
        order.zip,
      ]
        .filter(Boolean)
        .join(", "),
      distance: routeInfo?.distance,
      estimatedTime: routeInfo?.duration,
      customerName: order.name,
      customerContact: order.phoneNumber,
      paymentType: order.paymentMethod,
      restaurantName: foundSupplier.name,
    });

    console.log("Delivery : ", delivery);

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
        body: `You have received a delivery task for order ${id}`,
      });

      if (noti) {
        await notifyUser(deliveryBoyId, noti);
        console.log(noti);
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
export const getCompleteOrderById = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    const completeOrderSingle = await completeOrder.findById(_id);
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
export const updateCompleteOrder = async (req, res) => {
  const { id: _id } = req.params;
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
    created_by,
  } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    const updatedOrder = await completeOrder.findByIdAndUpdate(
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
        created_by,
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
export const deleteCompleteOrder = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    const deletedOrder = await completeOrder.findByIdAndDelete(_id);
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
