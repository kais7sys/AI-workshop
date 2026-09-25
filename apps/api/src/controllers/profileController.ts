import { Request, Response } from 'express';
import { db } from '../repositories/db.js';

export async function getProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const profile = await db.getProfileById(userId);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  res.json(profile);
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const updated = await db.updateProfile(userId, req.body);
  await db.createAuditLog({
    actor_id: userId,
    action: 'UPDATE_PROFILE',
    entity_type: 'profile',
    entity_id: userId,
    metadata: { fieldsUpdated: Object.keys(req.body) },
  });

  res.json(updated);
}
