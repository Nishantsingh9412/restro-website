import express from 'express';
import {
    getLowStockItems,
    getallStockItems
} from '../controllers/stockAlert.js';

const router = express.Router();

router.get('/get-low-stocks', getLowStockItems);

router.get('/get-all-stocks', getallStockItems);


export default router;

