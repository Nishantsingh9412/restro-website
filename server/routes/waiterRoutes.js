import express from "express";

import { getAllWaiters } from "../controllers/employees/waiterController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// get all shift of a waiter
router.get("/get-all", getAllWaiters);

export default router;
