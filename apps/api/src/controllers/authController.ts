import { Request, Response } from 'express';
import { db } from '../repositories/db.js';

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const profile = await db.getProfileById(req.user.id);
  res.json({
    user: req.user,
    profile,
  });
}

export async function refreshAuth(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({
    message: 'Token refreshed',
    user: req.user,
  });
}
