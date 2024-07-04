import express from 'express';
import {
    addItem,
    deleteItem,
    getAllItems,
    getItemById,
    updateItem,
    DeletAllItems,
} from '../controllers/itemManagController.js';




const router = express.Router();

//  get all items
router.get('/get-all-items/:id', getAllItems);

// Get Item by id
router.get('/get-item/:id', getItemById);

// Add All items
router.post('/additem', addItem);

// Update Item by id
router.patch('/updateitem/:id', updateItem);

// Delete Item by id
router.delete('/deleteitem/:id', deleteItem);

// Delete All Items 
router.delete('/delete-all-items', DeletAllItems);

export default router;
