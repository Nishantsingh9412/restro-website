import express from "express";

import { getAllHelpers } from "../../controllers/employees/helperController.js";

const router = express.Router();

// get all helpers
router.get("/get-all", getAllHelpers);

export default router;
