import express from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.get('/', auth, getAllUsers);

export default router;