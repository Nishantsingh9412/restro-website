import express from "express";

import { getAllWaiters } from "../../controllers/employees/waiterController.js";


const router = express.Router();

// get all shift of a waiter
router.get("/get-all", getAllWaiters);

export default router;
