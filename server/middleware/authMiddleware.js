import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

// Helper function to verify token and set req.user
const verifyToken = async (req, res, roleCheck) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    // If no token, send 401 Unauthorized response
    res.status(401).send({ error: "Access denied. No token provided." });
    return false;
  }

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional role check for admin
    if (roleCheck) {
      // Find admin by decoded token id
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        // If admin not found, send 404 Not Found response
        res.status(404).send({ error: "Unauthorized access" });
        return false;
      }
    }

    // Set decoded token to req.user
    req.user = decoded;
    return true;
  } catch (ex) {
    // If token is invalid, send 400 Bad Request response
    res.status(400).send({ error: "Invalid token." });
    console.log(ex);
    return false;
  }
};

// Middleware for admin
export const adminMiddleware = async (req, res, next) => {
  // Verify token with role check for admin
  if (await verifyToken(req, res, true)) next();
};

// Middleware for employee
export const employeeMiddleware = async (req, res, next) => {
  // Verify token with role check for employee
  if (await verifyToken(req, res, false)) next();
};
