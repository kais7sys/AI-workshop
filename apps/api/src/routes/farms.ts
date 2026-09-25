import { Router } from 'express';
import {
  listFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
  listFields,
  createField,
  updateField,
  deleteField,
} from '../controllers/farmController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import {
  farmCreateSchema,
  farmUpdateSchema,
  fieldCreateSchema,
  fieldUpdateSchema,
} from '../schemas/index.js';

export const farmRouter = Router();

farmRouter.use(authenticate);

// Farm CRUD
farmRouter.get('/', listFarms);
farmRouter.post('/', validateBody(farmCreateSchema), createFarm);
farmRouter.get('/:id', getFarmById);
farmRouter.patch('/:id', validateBody(farmUpdateSchema), updateFarm);
farmRouter.delete('/:id', deleteFarm);

// Field CRUD nested under farm
farmRouter.get('/:farmId/fields', listFields);
farmRouter.post('/:farmId/fields', validateBody(fieldCreateSchema), createField);

export const fieldRouter = Router();
fieldRouter.use(authenticate);
fieldRouter.patch('/:id', validateBody(fieldUpdateSchema), updateField);
fieldRouter.delete('/:id', deleteField);
