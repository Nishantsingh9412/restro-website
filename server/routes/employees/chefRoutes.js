import express from "express";

import { getAllChefs } from "../../controllers/employees/chefController.js";

const router = express.Router();

// get all chefs
router.get("/get-all", getAllChefs);

export default router;
