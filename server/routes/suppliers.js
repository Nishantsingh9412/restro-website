import express from 'express';
import {
    AddSupplier,
    UpdateSupplier,
    deleteSupplier,
    getSingleSupplier,
    getSupplier
} from '../controllers/supplierController.js';


const router = express.Router();

router.post('/add-supplier', AddSupplier)

router.get('/get-suppliers/:id', getSupplier);

router.get('/get-supplier-single/:id', getSingleSupplier);

router.patch('/update-supplier/:id', UpdateSupplier);

router.delete('/delete-supplier/:id', deleteSupplier);

export default router;


