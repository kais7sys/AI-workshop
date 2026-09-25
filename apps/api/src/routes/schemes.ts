import { Router } from 'express';
import {
  listSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
} from '../controllers/schemeController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { schemeCreateSchema, schemeUpdateSchema } from '../schemas/index.js';

export const schemeRouter = Router();

schemeRouter.get('/', listSchemes);
schemeRouter.get('/:id', getSchemeById);

schemeRouter.post('/', authenticate, requireRole('ADMIN'), validateBody(schemeCreateSchema), createScheme);
schemeRouter.patch('/:id', authenticate, requireRole('ADMIN'), validateBody(schemeUpdateSchema), updateScheme);
schemeRouter.delete('/:id', authenticate, requireRole('ADMIN'), deleteScheme);
