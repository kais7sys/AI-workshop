import { Router } from 'express';
import {
  listCases,
  getCaseById,
  createCase,
  updateOfficerCase,
} from '../controllers/caseController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { caseCreateSchema, caseUpdateSchema } from '../schemas/index.js';

export const caseRouter = Router();

caseRouter.use(authenticate);

caseRouter.get('/', listCases);
caseRouter.post('/', validateBody(caseCreateSchema), createCase);
caseRouter.get('/:id', getCaseById);
caseRouter.patch('/:id', validateBody(caseUpdateSchema), updateOfficerCase);

// Dedicated Officer Route namespace: /api/officer/cases
export const officerCaseRouter = Router();
officerCaseRouter.use(authenticate, requireRole('OFFICER', 'ADMIN'));
officerCaseRouter.get('/', listCases);
officerCaseRouter.patch('/:id', validateBody(caseUpdateSchema), updateOfficerCase);
