import { Router } from 'express';
import {
  listCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} from '../controllers/cropController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { cropCreateSchema, cropUpdateSchema } from '../schemas/index.js';

export const cropRouter = Router();

// Public / Authenticated read
cropRouter.get('/', listCrops);
cropRouter.get('/:id', getCropById);

// Admin-only management
cropRouter.post('/', authenticate, requireRole('ADMIN'), validateBody(cropCreateSchema), createCrop);
cropRouter.patch('/:id', authenticate, requireRole('ADMIN'), validateBody(cropUpdateSchema), updateCrop);
cropRouter.delete('/:id', authenticate, requireRole('ADMIN'), deleteCrop);
