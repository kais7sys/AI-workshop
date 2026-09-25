import { Request, Response } from 'express';
import { db } from '../repositories/db.js';
import { config } from '../config/index.js';

export async function listUsers(req: Request, res: Response): Promise<void> {
  const role = req.query.role as string | undefined;
  const users = await db.listProfiles(role);
  res.json(users);
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { role } = req.body;

  if (!['FARMER', 'OFFICER', 'ADMIN'].includes(role)) {
    res.status(400).json({ error: 'Invalid role specified.' });
    return;
  }

  const updated = await db.updateProfile(id, { role });
  await db.createAuditLog({
    actor_id: req.user?.id,
    action: 'CHANGE_USER_ROLE',
    entity_type: 'user',
    entity_id: id,
    metadata: { newRole: role },
  });

  res.json(updated);
}

export async function listAuditLogs(req: Request, res: Response): Promise<void> {
  const logs = await db.listAuditLogs(100);
  res.json(logs);
}

export async function getSystemMetrics(req: Request, res: Response): Promise<void> {
  const totalProfiles = db.profiles.length;
  const totalFarms = db.farms.length;
  const totalAdvisories = db.advisories.length;
  const totalCases = db.cases.length;
  const openCases = db.cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const activeAlerts = db.alerts.filter((a) => a.is_published).length;

  res.json({
    platformStatus: 'OPERATIONAL',
    uptimeSeconds: Math.floor(process.uptime()),
    aiEngine: {
      model: config.gemini.model,
      configured: Boolean(config.gemini.apiKey),
      mode: config.gemini.apiKey ? 'Google Gemini Live API' : 'Standalone Expert Agronomic Engine',
    },
    metrics: {
      totalProfiles,
      totalFarms,
      totalAdvisories,
      totalCases,
      openCases,
      activeAlerts,
    },
    database: {
      mode: db.isSupabaseConnected() ? 'Supabase Managed Cloud Postgres' : 'In-Memory Agronomic Datastore',
    },
  });
}
