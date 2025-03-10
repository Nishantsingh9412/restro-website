import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import compression from "compression";
import { Server } from "socket.io";

// Route imports
import itemRoutes from "./routes/item.js";
import lowStockItems from "./routes/lowStocks.js";
import supplierRoutes from "./routes/suppliers.js";
import orderRoutes from "./routes/orders.js";
import qrRoutes from "./routes/qr.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import addressRoutes from "./routes/address.js";
import deliveryOrderRoutes from "./routes/deliveryOrderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeeShiftRoute from "./routes/employeeShiftRoute.js";
import employeeAbsence from "./routes/absenceRoute.js";
import dineInOrderRoutes from "./routes/dineInOrderRoutes.js";
import takeAwayRoutes from "./routes/takeAwayRoutes.js";
import deliveryDashboardRoutes from "./routes/deliveryDashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import deliveryPersonnelRoutes from "./routes/deliveryPersonnelRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bartenderRoutes from "./routes/employees/bartenderRoutes.js";
import chefRoutes from "./routes/employees/chefRoutes.js";
import commonRoutes from "./routes/employees/commonRoutes.js";
import helperEmpRoutes from "./routes/employees/helperEmpRoutes.js";
import managerRoutes from "./routes/employees/managerRoutes.js";
import staffRoutes from "./routes/employees/staffRoutes.js";
import waiterRoutes from "./routes/employees/waiterRoutes.js";
import { sendLiveLocation, acceptOfferOrder } from "./utils/socket.js";

// Initialize express app
const app = express();
dotenv.config(); // Load environment variables from .env file

//For Production
// Origin Cors
const corsOptions = {
  origin: [
    "https://xn--trgastro-65a.de",
    "https://212.132.99.95",
    "https://shinehub.de",
  ], // Allow requests from your external server IP
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204s
};

// Middleware setup
app.use(express.json({ limit: "30mb", extended: true })); // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ limit: "30mb", extended: true })); // Parse URL-encoded data
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Static file serving (for image uploads)
app.use("/uploads", express.static("uploads"));

// Route middleware
app.use("/item-management", itemRoutes);
app.use("/stock-management", lowStockItems);
app.use("/supplier", supplierRoutes);
app.use("/orders", orderRoutes);
app.use("/qr-items", qrRoutes);
// app.use("/auth", authRoutes);
// app.use("/delivery-person", deliveryRoutes);
app.use("/delivery-person", deliveryPersonnelRoutes);
app.use("/address", addressRoutes);
app.use("/delivery-order", deliveryOrderRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/employee", employeeRoutes);
app.use("/shift", employeeShiftRoute);
app.use("/absence", employeeAbsence);
app.use("/dine-in", dineInOrderRoutes);
app.use("/take-away", takeAwayRoutes);
app.use("/notification", notificationRoutes);
app.use("/delivery-dashboard", deliveryDashboardRoutes);
// Auth routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Employee routes
app.use("/delivery", deliveryRoutes);
app.use("/common", commonRoutes);
app.use("/waiter", waiterRoutes);
app.use("/bartender", bartenderRoutes);
app.use("/chef", chefRoutes);
app.use("/helper", helperEmpRoutes);
app.use("/manager", managerRoutes);
app.use("/staff", staffRoutes);

// ---------------------------- Deployment Configuration ----------------------------
const __dirname = path.resolve(); // Set the __dirname to current directory

// Serve static files in production (e.g., frontend build files)
if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(
    express.static("./frontend/dist", {
      maxAge: "1d",
      etag: false,
    })
  );

  // Serve React app for any unknown routes in production
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend", "dist", "index.html"));
  });
} else {
  // Development mode base route
  app.get("/", (req, res) => {
    res.send("Development server running on port 8000");
  });
}
// ---------------------------- Deployment Configuration ----------------------------

// Port and Database URL from environment variables
const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.CONNECTION_URL;

// socket setup
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Replace with your frontend domain in production
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

const onlineUsers = new Map();

// Handle new socket connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Listen for user joining
  socket.on("userJoined", (userId) => {
    onlineUsers.set(userId, { socketId: socket.id, lastActive: Date.now() });
    console.log(`User ${userId} connected`);
  });

  // Listen for heartbeat to keep track of user activity
  socket.on("heartbeat", (userId) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).lastActive = Date.now();
      // console.log(
      //   `${onlineUsers.size} users online at ${new Date()}`,
      //   Array.from(onlineUsers.keys())
      // );
    }
  });

  // Listen for send location from the delivery employee
  socket.on("sendLocation", (data) => {
    console.log("Location received:", data);
    const { delEmpId, adminId, location } = data;
    sendLiveLocation(adminId, delEmpId, location);
  });

  socket.on("acceptOrder", (data) => {
    console.log("Order accepted:", data);
    const { delEmpId, supplierId, orderId } = data;
    acceptOfferOrder(orderId, delEmpId, supplierId);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    for (let [userId, userData] of onlineUsers.entries()) {
      if (userData.socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
  });

  // Optional: Ping for monitoring connection health
  socket.on("ping", () => {
    console.log("Ping received from:", socket.id);
  });
  socket.on("test", (message) => {
    console.log("Test event received:", message);
  });
});

// MongoDB Connection (Optimized)
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    // Start the server after successful DB connection
    // app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    httpServer.listen(PORT, () =>
      console.log(`Server running on port: ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

export { io, onlineUsers };
