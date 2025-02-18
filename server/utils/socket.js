import { io, onlineUsers } from "../server.js";
import DeliveryBoy from "../models/deliveryBoyModel.js";
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
  if (user) io.to(user.socketId).emit("delivery", offer);
};

// Sends delivery offers to multiple users
export const sendDeliveryOffers = async (ids = [], offer) => {
  const users = ids.map((id) => onlineUsers.get(id));
  users.forEach((user) => {
    if (user) io.to(user.socketId).emit("delivery", offer);
  });
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

export const sendLiveLocation = async (adminId, delEmpId, locationData) => {
  try {
    const admin = onlineUsers.get(adminId);
    if (admin) {
      io.to(admin.socketId).emit("liveLocation", {
        delEmpId,
        locationData,
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
