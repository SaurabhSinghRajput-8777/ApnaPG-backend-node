import { Router } from 'express';
import { syncUser, getMe, updateMe } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Public webhook
router.post('/sync', syncUser);

// Protected routes
router.use(authMiddleware);
router.get('/me', getMe);
router.patch('/me', updateMe);

export default router;
