import { Request, Response } from 'express';
import { db } from '../repositories/db.js';

export async function listCrops(req: Request, res: Response): Promise<void> {
  const crops = await db.listCrops();
  res.json(crops);
}

export async function getCropById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const crop = await db.getCropById(id);
  if (!crop) {
    res.status(404).json({ error: 'Crop not found' });
    return;
  }
  res.json(crop);
}

export async function createCrop(req: Request, res: Response): Promise<void> {
  const crop = await db.createCrop(req.body);
  await db.createAuditLog({
    actor_id: req.user?.id,
    action: 'CREATE_CROP',
    entity_type: 'crop',
    entity_id: crop.id,
    metadata: { name: crop.name },
  });
  res.status(201).json(crop);
}

export async function updateCrop(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const updated = await db.updateCrop(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Crop not found' });
    return;
  }
  res.json(updated);
}

export async function deleteCrop(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const success = await db.deleteCrop(id);
  if (!success) {
    res.status(404).json({ error: 'Crop not found' });
    return;
  }
  res.json({ success: true });
}
