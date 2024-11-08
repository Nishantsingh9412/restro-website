//TODO:Delete after project completion
import express from 'express';
import {
    getAllAdmins,
    deleteAdmin,
} from '../controllers/adminController.js';


const router = express.Router();

// get all admins
router.get('/get-all-admins', getAllAdmins);

// delete admin
router.delete('/delete-admin/:id', deleteAdmin);

export default router;