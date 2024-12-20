import express from "express";
import {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSingleSupplier,
  getSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.post("/add-supplier", addSupplier);

router.get("/get-suppliers/:id", getSupplier);

router.get("/get-supplier-single/:id", getSingleSupplier);

router.patch("/update-supplier/:id", updateSupplier);

router.delete("/delete-supplier/:id", deleteSupplier);

export default router;
