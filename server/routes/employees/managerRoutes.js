import express from "express";

import { getAllManagers } from "../../controllers/employees/managerController.js";

const router = express.Router();

// get all managers
router.get("/get-all", getAllManagers);

export default router;
