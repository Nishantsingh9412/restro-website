import express from 'express';
import {
    getLowStockItems,
    getAllStockItems
} from '../controllers/stockAlert.js';

const router = express.Router();

router.get('/get-low-stocks/:id', getLowStockItems);

router.get('/get-all-stocks/:id', getAllStockItems);


export default router;

