import { Router } from 'express';
import {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
} from '../controllers/alertController.js';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { alertCreateSchema, alertUpdateSchema } from '../schemas/index.js';

export const alertRouter = Router();

// Public / Authenticated read
alertRouter.get('/', optionalAuthenticate, listAlerts);

// Officer or Admin management
alertRouter.post('/', authenticate, requireRole('OFFICER', 'ADMIN'), validateBody(alertCreateSchema), createAlert);
alertRouter.patch('/:id', authenticate, requireRole('OFFICER', 'ADMIN'), validateBody(alertUpdateSchema), updateAlert);
alertRouter.delete('/:id', authenticate, requireRole('OFFICER', 'ADMIN'), deleteAlert);
