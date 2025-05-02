import { io, onlineUsers } from "../server.js";
import DeliveryBoy from "../models/deliveryBoyModel.js";
import Delivery from "../models/delivery.js";
import Notification from "../models/notification.js";
import { acceptDeliveryOrder } from "../controllers/deliveryOrderController.js";
// Emits a notification to a specific user
export const notifyUser = async (id, message) => {
  const user = onlineUsers.get(id);
  if (user) {
    io.to(user.socketId).emit("notification", message);
  }
};

// Emits a notification to multiple users
export const notifyUsers = async (ids = [], message) => {
  const users = ids.map((id) => onlineUsers.get(id));
  users.forEach((user) => {
    if (user) io.to(user.socketId).emit("notification", message);
  });
};

// Sends a delivery offer to a specific user
export const sendDeliveryOffer = async (id, offer) => {
  const user = onlineUsers.get(id);
  console.log("User:", user);
  if (user) io.to(user.socketId).emit("delivery", offer);
};

// Sends delivery offers to multiple users
export const sendDeliveryOffers = async (ids = [], offer, supplier) => {
  const users = ids.map((id) => onlineUsers.get(id));
  users.forEach((user) => {
    if (user) io.to(user.socketId).emit("deliveryOffer", offer, supplier);
  });
};

export const acceptedDeliveryOffer = async (id, orderId, data) => {
  const user = onlineUsers.get(id);
  console.log("User:", user);
  if (user) io.to(user.socketId).emit("acceptedDeliveryOffer", data, orderId);
};

// Send Takeaway order offer to a specific user
export const sendTakeawayOffer = async (id, offer) => {
  const user = onlineUsers.get(id);
  if (user) io.to(user.socketId).emit("takeaway", offer);
};

export const sendDineInOfferToWaiter = async (id, offer) => {
  const user = onlineUsers.get(id);
  if (user) io.to(user.socketId).emit("dineinwaiter", offer);
};

export const sendDineInOfferToChef = async (id, offer) => {
  const user = onlineUsers.get(id);
  if (user) io.to(user.socketId).emit("dineinchef", offer);
};

// Hides a delivery offer for all users
export const hideDeliveryOffer = async (offerId) => {
  const users = Array.from(onlineUsers.keys()).map((id) => onlineUsers.get(id));
  users.forEach((user) => {
    if (user)
      io.to(user.socketId).emit("hideDeliveryOffer", {
        userId: user,
        deliveryId: offerId,
      });
  });
};

export const sendLiveLocation = async (
  adminId,
  delEmpName,
  delEmpId,
  locationData
) => {
  try {
    const admin = onlineUsers.get(adminId);
    if (admin) {
      // Send live location to the admin
      io.to(admin.socketId).emit("liveLocation", {
        delEmpId,
        delEmpName,
        locationData,
        status: "online",
      });
      await DeliveryBoy.findByIdAndUpdate(delEmpId, {
        lastLocation: {
          lat: locationData.latitude,
          lng: locationData.longitude,
        },
      });
    }
  } catch (error) {
    console.error("Error sending live location:", error);
  }
};

// Updates the live location status of a delivery employee
export const updateLiveLocationStatus = async (delEmpId) => {
  try {
    const delEmp = await DeliveryBoy.findById(delEmpId);
    if (!delEmp) return; // If delivery employee not found, return

    // Get admin id from the delivery employee
    const adminId = delEmp.created_by.toString();
    if (!adminId) return; // If admin id not found, return
    
    const admin = onlineUsers.get(adminId);
    if (admin) {
      // Send live location to the admin
      io.to(admin.socketId).emit("liveLocation", {
        delEmpId,
        delEmpName: delEmp?.name,
        locationData: delEmp?.lastLocation,
        status: "offline",
      });
    }
  } catch (error) {
    console.error("Error updating live location status:", error);
  }
};

// Accepts a delivery order and notifies the supplier
export const acceptOfferOrder = async (orderId, delEmpId, supplierId) => {
  try {
    const order = await Delivery.findOne({ orderId });
    if (order) return; // If order is already accepted, return

    const delBoy = await DeliveryBoy.findById(delEmpId);
    if (!delBoy) return; // If delivery boy not found, return

    const delOrder = await acceptDeliveryOrder(orderId, delBoy, supplierId);
    if (!delOrder) return; // If order not created or accepted, return

    const notification = await Notification.create({
      sender: delEmpId,
      receiver: supplierId,
      heading: `Order Accepted By ${delBoy.name}`,
      body: `Delivery boy ${delBoy.name} accepted the order ${orderId}`,
    });

    if (notification) {
      await notifyUser(notification.receiver, notification); // Notify the supplier
    }
  } catch (error) {
    console.error("Error accepting order:", error);
  }
};
