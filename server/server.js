import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import http from "http";

import passportSetup from "./controllers/passport.js";

import itemRoutes from "./routes/item.js";
import lowStockItems from "./routes/lowStocks.js";
import supplierRoutes from "./routes/suppliers.js";
import orderRoutes from "./routes/orders.js";
import qrRoutes from "./routes/qr.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.js";
import deliveryPersonnelRoutes from "./routes/deliveryPersonnelRoutes.js";
import addressRoutes from "./routes/address.js";
import compOrderRoutes from "./routes/compOrderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import deliveryDashboardRoutes from "./routes/deliveryDashboardRoutes.js";
// import userRoutes from './routes/users.js'

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// // For image upload
// app.use(express.static(__dirname + '/public'));
// To serve static files to frontend for multer
app.use("/uploads", express.static("uploads"));
app.use("/item-management", itemRoutes);
app.use("/stock-management", lowStockItems);
app.use("/supplier", supplierRoutes);
app.use("/orders", orderRoutes);
app.use("/qr-items", qrRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/delivery-person", deliveryPersonnelRoutes);
app.use("/address", addressRoutes);
app.use("/complete-order", compOrderRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/notification", notificationRoutes);
app.use("/delivery-dashboard", deliveryDashboardRoutes);

// ----------------------------deployment--------------------------------------

const __dirname = path.resolve();
// console.log(__dirname)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("on 8000 port ");
  });
}
// ----------------------------deployment--------------------------------------

// app.get('/', (req, res) => {
//     res.send(" Server is up and running on PORT 8000");
// })

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.CONNECTION_URL;

// socket setup
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const onlineUsers = new Map();

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
      console.log(
        Array.from(onlineUsers.keys()).length + " Online at " + new Date(),
        Array.from(onlineUsers.keys())
      );
    }
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
});

mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    httpServer.listen(PORT, () =>
      console.log(`Server running on port: ${PORT}`)
    )
  )
  .catch((error) => console.log(error.message));

export { io, onlineUsers };
