import { io } from "socket.io-client";

// Retrieve base URL from environment variable
const baseUrl = import.meta.env.VITE_APP_WSS_URL || "wss://xn--trgastro-65a.de";

// Ensure base URL is defined
if (!baseUrl) {
  throw new Error("Base URL for APIs is not defined");
}

// Create and configure socket connection
export const socket = io(baseUrl, {
  path: "/socket.io/",
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false, // Prevent automatic connection
});

// Handle connection error
socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

// Handle successful reconnection
socket.on("reconnect", (attemptNumber) => {
  console.log(`Reconnected successfully on attempt ${attemptNumber}`);
});

// Handle disconnection
socket.on("disconnect", (reason) => {
  console.warn(`Socket disconnected: ${reason}`);
});

// Manually initiate the connection if it's not already connected
export const connectSocketIfDisconnected = () => {
  console.log("Socket connected manager:", socket.connected);
  if (!socket.connected) {
    socket.connect(); // Manually trigger the connection
  }
};