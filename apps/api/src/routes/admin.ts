import { Router } from 'express';
import {
  listUsers,
  updateUserRole,
  listAuditLogs,
  getSystemMetrics,
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();

// Strict Admin-only middleware
adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/users', listUsers);
adminRouter.patch('/users/:id/role', updateUserRole);
adminRouter.get('/audit-logs', listAuditLogs);
adminRouter.get('/system', getSystemMetrics);
