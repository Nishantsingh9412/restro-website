import { io } from "../server.js";

const onlineUsers = new Map();
console.log(onlineUsers);

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Listen for user joining
  socket.on("userJoined", (userId) => {
    onlineUsers.set(userId, { socketId: socket.id, lastActive: Date.now() });
    console.log(`User ${userId} connected`);
  });

  // Listen for heartbeat
  socket.on("heartbeat", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).lastActive = Date.now();
    }
  });

  // Periodically check for inactive users
  setInterval(() => {
    const now = Date.now();
    for (let [userId, userData] of onlineUsers.entries()) {
      if (now - userData.lastActive > 30000) {
        // 30 seconds of inactivity
        onlineUsers.delete(userId);
      }
    }
  }, 10000); // Check every 10 seconds

  // Handle user disconnect
  socket.on("disconnect", () => {
    for (let [userId, userData] of onlineUsers.entries()) {
      if (userData.socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
  });
});
