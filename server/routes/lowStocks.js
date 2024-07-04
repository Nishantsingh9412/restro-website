import express from 'express';
import {
    getLowStockItems,
    getallStockItems
} from '../controllers/stockAlert.js';

const router = express.Router();

router.get('/get-low-stocks/:id', getLowStockItems);

router.get('/get-all-stocks/:id', getallStockItems);


export default router;

