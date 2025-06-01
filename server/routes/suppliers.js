import express from "express";
import {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSingleSupplier,
  getAllSupplier,
  getSupplierContacts,
} from "../controllers/supplierController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-supplier", accessMiddleware(), addSupplier);

router.get("/get-all-suppliers", accessMiddleware(), getAllSupplier);

router.get("/get-supplier-contacts", accessMiddleware(), getSupplierContacts);

router.get("/get-supplier-single/:id", accessMiddleware(), getSingleSupplier);

router.patch("/update-supplier/:id", accessMiddleware(), updateSupplier);

router.delete("/delete-supplier/:id", accessMiddleware(), deleteSupplier);

export default router;
