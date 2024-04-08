import express from 'express';
import {
    AddSupplier,
    UpdateSupplier,
    deleteSupplier,
    getSupplier
} from '../controllers/supplierController.js';


const router = express.Router();

router.post('/add-supplier', AddSupplier)

router.get('/get-suppliers', getSupplier);

router.patch('/update-supplier/:id', UpdateSupplier);

router.delete('/delete-supplier/:id', deleteSupplier);

export default router;


