import { io, onlineUsers } from "../server.js";

// emits
export const notifyUser = async (id, message) => {
  const user = onlineUsers.get(id);
  if (user) {
    io.to(user.socketId).emit("notification", message);
  }
};

export const notifyUsers = async (ids = [], message) => {
  const users = ids.map((id) => onlineUsers.get(id));
  users.forEach((user) => {
    if (user) io.to(user.socketId).emit("notification", message);
  });
};

export const sendDeliveryOffer = async (id, offer) => {
  const user = onlineUsers.get(id);
  if (user) io.to(user.socketId).emit("delivery", offer);
};

export const sendDeliveryOffers = async (ids = [], offer) => {
  const users = ids.map((id) => onlineUsers.get(id));
  users.forEach((user) => {
    if (user) io.to(user.socketId).emit("delivery", offer);
  });
};

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
