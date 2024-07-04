import express from 'express';
import {
    AddOrderItem,
    deleteOrderItem,
    getAllOrderItems,
    getDrinksOnly,
    getSingleOrderItem,
    searchDrinksOnly,
    searchOrderItems,
    updateOrderItem
} from '../controllers/OrderController.js';

const router = express.Router();

router.post('/add-order-item', AddOrderItem);

router.get('/get-single-order-item/:id', getSingleOrderItem);

router.get('/get-all-order-items/:id', getAllOrderItems);

router.get('/getDrinksOnly/:id', getDrinksOnly);

router.patch('/update-order-item/:id', updateOrderItem);

router.delete('/delete-order-item/:id', deleteOrderItem);

router.get('/search-order-items/:id', searchOrderItems);

router.get('/search-drinks-only/:id', searchDrinksOnly);






export default router;