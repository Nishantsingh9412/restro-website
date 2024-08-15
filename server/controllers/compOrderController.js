import mongoose from "mongoose";
import completeOrder from "../models/completeOrder.js";
import delivery from "../models/delivery.js";
import authDeliv from "../models/authDeliv.js";
import Delivery from "../models/delivery.js";
import Auth from "../models/auth.js";
import Notification from "../models/notification.js";
import { notifyUser, sendDeliveryOffer } from "../utils/socket.js";
import axios from "axios";

// const getCoordinates = async (jsonData) => {
//   try {
//     const response = await axios.get(
//       "https://us1.locationiq.com/v1/search.php",
//       {
//         params: {
//           key: process.env.LOCATIONIQ_API_KEY,
//           q: jsonData,
//           format: "json",
//         },
//       }
//     );
//     console.log(response);
//     const coordinates = {
//       lat: response.data[0].lat,
//       lon: response.data[0].lon,
//     };
//     return coordinates;
//   } catch (error) {
//     console.error("Error fetching coordinates:", error);
//     return null;
//   }
// };

export const createCompleteOrder = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      paymentMethod,
      deliveryMethod,
      pickupLocation,
      pickupLocationName,
      lat,
      lng,
      address,
      address2,
      city,
      state,
      zip,
      noteFromCustomer,
      orderItems,
      TotalPrice,
      created_by,
    } = req.body;
    console.log(req.body);
    if (!name || !phoneNumber || !address || !TotalPrice || !pickupLocation) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    if (!created_by) {
      return res
        .status(401)
        .json({ success: false, message: "Session expired login again" });
    } else {
      const formattedOrderItems = orderItems.map((item) => ({
        // item: new mongoose.Types.ObjectId(item._id),
        item: new mongoose.Types.ObjectId(item._id),
        quantity: item.quantity,
        total: item.priceVal * item.quantity,
      }));
      const orderId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
        1000000 + Math.random() * 9000000
      )}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      // const coords = await getCoordinates(
      //   [address, address2, city, state, "IN", zip].filter(Boolean).join(", ")
      // );
      console.log(lat,lng);
      if (!lat || !lng)
        return res
          .status(500)
          .json({ success: false, message: "Error fetching location" });

      const newCompleteOrder = await completeOrder.create({
        name,
        phoneNumber,
        paymentMethod,
        deliveryMethod,
        pickupLocation,
        pickupLocationName,
        lat:lat,
        lng:lng,
        address,
        address2,
        city,
        state,
        zip,
        noteFromCustomer,
        orderItems: formattedOrderItems,
        TotalPrice,
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
    }
  } catch (err) {
    console.log("Error from Order Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

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
    const finalOrders = await Promise.all(
      completeOrders.map(async (order) => {
        console.log(order);
        const assigned = await delivery
          .findOne({ orderId: order?.orderId })
          .select("assignedTo");
        if (assigned) {
          console.log("assigned", assigned);
          const assignedTo = await authDeliv
            .findById(assigned.assignedTo)
            .select("name");
          console.log("assignedTo", assignedTo);
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

const getRouteData = async (start, end) => {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/directions/driving/${start.lng},${start.lat};${end.lng},${end.lat}?key=${apiKey}&overview=simplified&annotations=false`
    );
    const data = response.data;
    if (data.code === "Ok") {
      return {
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in getRouteData,", error);
    return null;
  }
};

export const allotOrderDelivery = async (req, res) => {
  const { id } = req.params;
  const { supplier, deliveryBoyId } = req.body;
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

    const foundSupplier = await Auth.findById(supplier);
    if (!foundSupplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });

    const routeInfo = await getRouteData(order.pickupLocation, {
      lat: order.lat,
      lng: order.lng,
    });

    console.log("routeInfo", routeInfo);

    const delivery = await Delivery.create({
      orderId: id,
      supplier,
      assignedTo: deliveryBoyId,
      pickupLocation: order.pickupLocation,
      deliveryLocation: { lat: order.lat, lng: order.lng },
      distance: routeInfo?.distance,
      estimatedTime: routeInfo?.duration,
      customerName: order.name,
      customerContact: order.phoneNumber,
      paymentType: order.paymentMethod,
      restaurantName: foundSupplier.name,
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
        body: `You have recieved a delivery task for order ${id}`,
      });
      if (noti) await notifyUser(deliveryBoyId, noti);
    }
    res.status(200).json({ success: true, message: "Order Alloted" });
  } catch (err) {
    console.log("Error from allotOrderDelivery Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

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
    TotalPrice,
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
        TotalPrice,
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
