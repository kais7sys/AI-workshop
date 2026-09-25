import { Request, Response } from 'express';
import { db } from '../repositories/db.js';

export async function listAlerts(req: Request, res: Response): Promise<void> {
  // If officer or admin, can see all draft and published alerts
  if (req.user?.role === 'OFFICER' || req.user?.role === 'ADMIN') {
    const alerts = await db.listAllAlerts();
    res.json(alerts);
    return;
  }

  // Farmers see published alerts
  const alerts = await db.listPublishedAlerts();
  res.json(alerts);
}

export async function createAlert(req: Request, res: Response): Promise<void> {
  const alert = await db.createAlert({
    ...req.body,
    created_by: req.user?.id,
  });

  // If published, trigger in-app notification to all farmers
  if (alert.is_published) {
    const farmers = await db.listProfiles('FARMER');
    for (const farmer of farmers) {
      await db.createNotification({
        user_id: farmer.id,
        title: `Alert: ${alert.title}`,
        message: alert.description.slice(0, 150) + '...',
        type: 'ALERT',
      });
    }
  }

  await db.createAuditLog({
    actor_id: req.user?.id,
    action: 'CREATE_ALERT',
    entity_type: 'alert',
    entity_id: alert.id,
    metadata: { title: alert.title, severity: alert.severity },
  });

  res.status(201).json(alert);
}

export async function updateAlert(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const updated = await db.updateAlert(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Alert not found' });
    return;
  }
  res.json(updated);
}

export async function deleteAlert(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const success = await db.deleteAlert(id);
  if (!success) {
    res.status(404).json({ error: 'Alert not found' });
    return;
  }
  res.json({ success: true });
}
