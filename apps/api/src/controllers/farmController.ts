import { Request, Response } from 'express';
import { db } from '../repositories/db.js';

export async function listFarms(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Officers & Admins can query by specific farmer ownerId
  const targetOwnerId =
    (req.user?.role === 'OFFICER' || req.user?.role === 'ADMIN') && req.query.ownerId
      ? String(req.query.ownerId)
      : userId;

  const farms = await db.listFarmsByOwner(targetOwnerId);
  res.json(farms);
}

export async function getFarmById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const farm = await db.getFarmById(id);

  if (!farm) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }

  // RLS check: farmer can only view their own farm
  if (req.user?.role === 'FARMER' && farm.owner_id !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You do not have access to this farm.' });
    return;
  }

  res.json(farm);
}

export async function createFarm(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const farm = await db.createFarm({
    ...req.body,
    owner_id: userId,
  });

  await db.createAuditLog({
    actor_id: userId,
    action: 'CREATE_FARM',
    entity_type: 'farm',
    entity_id: farm.id,
    metadata: { name: farm.name },
  });

  res.status(201).json(farm);
}

export async function updateFarm(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const farm = await db.getFarmById(id);

  if (!farm) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }

  if (req.user?.role === 'FARMER' && farm.owner_id !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You do not own this farm.' });
    return;
  }

  const updated = await db.updateFarm(id, req.body);
  res.json(updated);
}

export async function deleteFarm(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const farm = await db.getFarmById(id);

  if (!farm) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }

  if (req.user?.role === 'FARMER' && farm.owner_id !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You do not own this farm.' });
    return;
  }

  await db.deleteFarm(id);
  res.json({ success: true, message: 'Farm deleted successfully' });
}

// -----------------------------------------------------------------------------
// Fields
// -----------------------------------------------------------------------------
export async function listFields(req: Request, res: Response): Promise<void> {
  const { farmId } = req.params;
  const farm = await db.getFarmById(farmId);

  if (!farm) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }

  if (req.user?.role === 'FARMER' && farm.owner_id !== req.user.id) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const fields = await db.listFieldsByFarm(farmId);
  res.json(fields);
}

export async function createField(req: Request, res: Response): Promise<void> {
  const { farmId } = req.params;
  const farm = await db.getFarmById(farmId);

  if (!farm) {
    res.status(404).json({ error: 'Farm not found' });
    return;
  }

  if (req.user?.role === 'FARMER' && farm.owner_id !== req.user.id) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const field = await db.createField({
    ...req.body,
    farm_id: farmId,
  });

  res.status(201).json(field);
}

export async function updateField(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const updated = await db.updateField(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Field not found' });
    return;
  }
  res.json(updated);
}

export async function deleteField(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const success = await db.deleteField(id);
  if (!success) {
    res.status(404).json({ error: 'Field not found' });
    return;
  }
  res.json({ success: true });
}
