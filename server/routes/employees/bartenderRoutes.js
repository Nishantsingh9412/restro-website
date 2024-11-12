import express from "express";
import { getAllBartenders } from "../../controllers/employees/bartenderController.js";

const router = express.Router();

// get all bartenders
router.get("/get-all", getAllBartenders);

export default router;
