import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { profileUpdateSchema } from '../schemas/index.js';

export const profileRouter = Router();

profileRouter.get('/', authenticate, getProfile);
profileRouter.patch('/', authenticate, validateBody(profileUpdateSchema), updateProfile);
