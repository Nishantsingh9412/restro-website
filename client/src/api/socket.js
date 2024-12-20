import { io } from "socket.io-client";

// Retrieve base URL from environment variable
const baseUrl =
  import.meta.env.VITE_APP_BASE_URL_FOR_APIS || "http://localhost:8000";

// Ensure base URL is defined
if (!baseUrl) {
  throw new Error("Base URL for APIs is not defined");
}

console.log("API Base URL:", baseUrl); // Optional: Log base URL for debugging

// Create and configure socket connection
export const socket = io(baseUrl, {
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

// Manually initiate the connection if it's not already connected
export const connectSocketIfDisconnected = () => {
  console.log("Socket connected manager:", socket.connected);
  if (!socket.connected) {
    socket.connect(); // Manually trigger the connection
  }
};

connectSocketIfDisconnected(); // Ensure socket is connected
