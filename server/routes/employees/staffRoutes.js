import express from "express";

import { getAllStaffs } from "../../controllers/employees/staffController.js";

const router = express.Router();

// get all staff
router.get("/get-all", getAllStaffs);

export default router;
