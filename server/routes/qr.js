import express from 'express';
import {
    addQRItem,
    deleteAllQRItems,
    deleteQRItem,
    getAllQRItems,
    getSingleQRItem,
    searchItemsQR,
    updateQrItem
} from '../controllers/qrController.js';


const router = express.Router();

router.patch('/inc-qr-items/:itemQrData',searchItemsQR)

router.post('/add-qr-item', addQRItem);

router.get('/get-single-qr-item/:id', getSingleQRItem);

router.get('/get-all-qr-items', getAllQRItems);

router.patch('/update-qr-item/:id', updateQrItem);

router.delete('/delete-qr-item', deleteQRItem);

router.delete('/delete-all-qr-items', deleteAllQRItems);


export default router;

