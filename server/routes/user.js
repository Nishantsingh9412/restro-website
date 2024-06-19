import express from 'express';
import { singleUserData, updateUserProfilePic } from '../controllers/user.js';
import { upload } from '../middleware/fileupload.js';

const router = express.Router();

router.get('/get-user/:id', singleUserData);    // get user by id
router.patch('/profile-pic-update/:id',upload.single('profile_picture'),updateUserProfilePic)

export default router;