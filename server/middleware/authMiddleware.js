import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).send({ error: "Unauthorized access" });
    }

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ error: "Invalid token." });
    console.log(ex);
  }
};

export default authMiddleware;
