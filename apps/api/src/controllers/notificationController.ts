import { Request, Response } from 'express';
import { db } from '../repositories/db.js';

export async function listNotifications(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const notifications = await db.listNotificationsByUser(userId);
  res.json(notifications);
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const success = await db.markNotificationRead(id, userId);
  res.json({ success });
}

export async function markAllAsRead(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  await db.markAllNotificationsRead(userId);
  res.json({ success: true });
}
