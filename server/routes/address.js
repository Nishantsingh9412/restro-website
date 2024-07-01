import express from 'express';
import {
    getsingleAddress,
    postAddress,
    updateSingleAddress
} from '../controllers/addressController.js';


const router = express.Router();

// add address
router.post('/post-address', postAddress);
// get address
router.get('/get-single-address/:id', getsingleAddress);
// update address
router.patch('/update-address/:id', updateSingleAddress);



export default router;