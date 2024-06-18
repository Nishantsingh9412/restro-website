import express from 'express';
import passport from 'passport';

import {
    signupController,
    loginController,
    authenticateUser,
    authFailed,
    authSuccess,
    logoutUser
} from '../controllers/auth.js'
import { upload } from '../middleware/fileupload.js';

const router = express.Router();

router.get('/google/callback', authenticateUser);

router.get('/login/failed', authFailed);

router.get('/login/success', authSuccess);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/logout', logoutUser);



router.post('/signup', upload.single('profile_picture') , signupController);

router.post('/login', loginController);







export default router;