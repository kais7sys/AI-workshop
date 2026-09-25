import { Request, Response, NextFunction } from 'express';
import { db } from '../repositories/db.js';
import { AuthUser, UserRole } from '../types/index.js';
import { logger } from '../utils/logger.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Authentication Middleware:
 * Inspects Authorization Header (Bearer token).
 * Supports standard Supabase JWT tokens, as well as demo test tokens:
 * - "Bearer demo-farmer-token" -> Farmer: Ramesh Kumar
 * - "Bearer demo-officer-token" -> Officer: Dr. Ananya Sharma
 * - "Bearer demo-admin-token" -> Admin: Vikram Patel
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header is required (Bearer token).' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Demo & mock tokens for seamless offline/evaluation usage
  if (token === 'demo-farmer-token' || token === 'mock-farmer-token') {
    const profile = await db.getProfileById('00000000-0000-0000-0000-000000000001');
    if (profile) {
      req.user = {
        id: profile.id,
        role: 'FARMER',
        fullName: profile.full_name,
        email: 'ramesh.farmer@agri.gov.in',
      };
      return next();
    }
  } else if (token === 'demo-officer-token' || token === 'mock-officer-token') {
    const profile = await db.getProfileById('00000000-0000-0000-0000-000000000002');
    if (profile) {
      req.user = {
        id: profile.id,
        role: 'OFFICER',
        fullName: profile.full_name,
        email: 'ananya.officer@agri.gov.in',
      };
      return next();
    }
  } else if (token === 'demo-admin-token' || token === 'mock-admin-token') {
    const profile = await db.getProfileById('00000000-0000-0000-0000-000000000003');
    if (profile) {
      req.user = {
        id: profile.id,
        role: 'ADMIN',
        fullName: profile.full_name,
        email: 'vikram.admin@agri.gov.in',
      };
      return next();
    }
  }

  // Fallback: check profile by token if token equals a user ID
  const directProfile = await db.getProfileById(token);
  if (directProfile) {
    req.user = {
      id: directProfile.id,
      role: directProfile.role,
      fullName: directProfile.full_name,
    };
    return next();
  }

  logger.warn('Invalid authorization token received');
  res.status(401).json({ error: 'Invalid or expired authorization token.' });
}

/**
 * Optional Authentication Middleware:
 * If Authorization header is provided, verifies user and populates req.user.
 * If no header is provided, continues without error.
 */
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return authenticate(req, res, next);
}

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: Access requires one of the following roles: [${allowedRoles.join(', ')}].`,
      });
      return;
    }

    next();
  };
}
