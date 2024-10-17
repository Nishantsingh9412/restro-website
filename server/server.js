import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import passportSetup from "./controllers/passport.js";

// Route imports
import itemRoutes from "./routes/item.js";
import lowStockItems from "./routes/lowStocks.js";
import supplierRoutes from "./routes/suppliers.js";
import orderRoutes from "./routes/orders.js";
import qrRoutes from "./routes/qr.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import addressRoutes from "./routes/address.js";
import compOrderRoutes from "./routes/compOrderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeeShiftRoute from "./routes/employeeShiftRoute.js";
import employeeAbsence from "./routes/absenceRoute.js";
import dineInOrderRoutes from "./routes/dineInOrderRoutes.js";
import takeAwayRoutes from "./routes/takeAwayRoutes.js";

const app = express();
dotenv.config(); // Load environment variables from .env file

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
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/delivery-person", deliveryRoutes);
app.use("/address", addressRoutes);
app.use("/complete-order", compOrderRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/employee", employeeRoutes);
app.use("/shift", employeeShiftRoute);
app.use("/absence", employeeAbsence);
app.use("/dine-in", dineInOrderRoutes);
app.use("/take-away", takeAwayRoutes);

// ---------------------------- Deployment Configuration ----------------------------
const __dirname = path.resolve(); // Set the __dirname to current directory

// Serve static files in production (e.g., frontend build files)
if (process.env.NODE_ENV !== "production") {
  app.use(express.static("./frontend/dist"));

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

// MongoDB Connection (Optimized)
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    // Start the server after successful DB connection
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });
