import express from 'express';
import {
    createDeliveryPersonnel,
    deleteAllDeliveryPersonnel,
    deleteDeliveryPersonnel,
    getDeliveryPersonnelSingle,
    getDeliveryPersonnels,
    updateDeliveryPersonnel
}
    from '../controllers/deliveryPersonnel.js';

const router = express.Router();

router.get('/get-all', getDeliveryPersonnels);
router.post('/create-one', createDeliveryPersonnel);
router.patch('/update-del-person/:id', updateDeliveryPersonnel);
router.get('/get-single/:id', getDeliveryPersonnelSingle);
router.delete('/delete-single/:id', deleteDeliveryPersonnel)
router.delete('/delete-all', deleteAllDeliveryPersonnel)


export default router;