import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, updateProfile, deleteAccount } from '../controllers/user.controller.js';

const router = Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.delete('/account', requireAuth, deleteAccount);

export default router;
