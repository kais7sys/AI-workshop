import { Request, Response } from 'express';
import { db } from '../repositories/db.js';

export async function listSchemes(req: Request, res: Response): Promise<void> {
  const query = req.query.q as string | undefined;
  const schemes = await db.listSchemes(query);
  res.json(schemes);
}

export async function getSchemeById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const scheme = await db.getSchemeById(id);
  if (!scheme) {
    res.status(404).json({ error: 'Scheme not found' });
    return;
  }
  res.json(scheme);
}

export async function createScheme(req: Request, res: Response): Promise<void> {
  const scheme = await db.createScheme(req.body);
  await db.createAuditLog({
    actor_id: req.user?.id,
    action: 'CREATE_SCHEME',
    entity_type: 'scheme',
    entity_id: scheme.id,
    metadata: { name: scheme.name },
  });
  res.status(201).json(scheme);
}

export async function updateScheme(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const updated = await db.updateScheme(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Scheme not found' });
    return;
  }
  res.json(updated);
}

export async function deleteScheme(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const success = await db.deleteScheme(id);
  if (!success) {
    res.status(404).json({ error: 'Scheme not found' });
    return;
  }
  res.json({ success: true });
}
