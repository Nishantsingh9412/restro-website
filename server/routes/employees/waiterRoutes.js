import express from "express";

import { getAllWaiters, getAllDelivery } from "../../controllers/employees/waiterController.js";


const router = express.Router();

// get all shift of a waiter
router.get("/get-all", getAllDelivery);

export default router;
