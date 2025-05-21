import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Employee from "../models/employeeModel.js";
import { userTypes } from "../utils/utils.js";

const verifyTokenAndAccess = async (req, res, requiredPermission = null) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .send({ error: "Internal server error. JWT secret is not set." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userModel = decoded.role === userTypes.ADMIN ? Admin : Employee;
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .send({ error: `Unauthorized access. ${decoded.role} not found.` });
    }

    if (
      decoded.role === "employee" &&
      requiredPermission &&
      !user.permissions?.some(
        (permission) => permission.label === requiredPermission
      )
    ) {
      return res.status(403).send({
        error: `Access denied. You lack the permission for ${requiredPermission}.`,
      });
    }

    req.user = user;
    return true;
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Invalid token." });
  }
};
export const accessMiddleware = (requiredPermission = null) => {
  return async (req, res, next) => {
    const result = await verifyTokenAndAccess(req, res, requiredPermission);
    if (result === true) {
      next();
    } else {
      // Ensure the response is ended to prevent further processing
      res.end();
    }
  };
};
