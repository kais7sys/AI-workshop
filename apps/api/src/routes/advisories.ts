import { Router } from 'express';
import {
  createAdvisory,
  listAdvisories,
  getAdvisoryById,
  analyzeDisease,
} from '../controllers/advisoryController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { advisoryRequestSchema, diseasePestRequestSchema } from '../schemas/index.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

export const advisoryRouter = Router();

advisoryRouter.use(authenticate);

advisoryRouter.post('/', aiRateLimiter, validateBody(advisoryRequestSchema), createAdvisory);
advisoryRouter.get('/', listAdvisories);
advisoryRouter.get('/:id', getAdvisoryById);
advisoryRouter.post('/disease-check', aiRateLimiter, validateBody(diseasePestRequestSchema), analyzeDisease);
