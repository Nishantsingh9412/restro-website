import express from 'express';
import {
    contactInfo,
    getExpiredItemsController,
    getSupplierByLocationController,
    lowStocksCount,
    totalStocksController,
    searchContacts
} from '../controllers/dashboardController.js';


const router = express.Router();
// get total stocks quantity
router.get('/total-stocks-quantity', totalStocksController)
// get low stocks quantity 
router.get('/low-stocks-quantity', lowStocksCount)
// get expired items
router.get('/expired-items', getExpiredItemsController)
// get supplier location 
router.get('/supplier-location', getSupplierByLocationController)
// get supplier contacts
router.get('/contacts', contactInfo)

router.get('/search-contacts', searchContacts)



export default router;
