import { Router } from 'express';
import { getCurrentUser, refreshAuth } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.get('/me', authenticate, getCurrentUser);
authRouter.post('/refresh', authenticate, refreshAuth);
