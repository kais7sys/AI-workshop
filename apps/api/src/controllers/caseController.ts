import { Request, Response } from 'express';
import { db } from '../repositories/db.js';
import { generateCaseSummary } from '../ai/gemini.js';

export async function listCases(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (user.role === 'FARMER') {
    const cases = await db.listCases({ farmerId: user.id });
    res.json(cases);
    return;
  }

  if (user.role === 'OFFICER') {
    // Return cases assigned to this officer, or open cases available for review
    const cases = await db.listCases({ status: req.query.status as string });
    res.json(cases);
    return;
  }

  // Admin
  const allCases = await db.listCases();
  res.json(allCases);
}

export async function getCaseById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const c = await db.getCaseById(id);

  if (!c) {
    res.status(404).json({ error: 'Support case not found' });
    return;
  }

  // RLS check
  if (req.user?.role === 'FARMER' && c.farmer_id !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You do not have access to this case.' });
    return;
  }

  res.json(c);
}

export async function createCase(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { farm_id, category, priority, description } = req.body;

  // Farm details context
  let farmContext = '';
  if (farm_id) {
    const farm = await db.getFarmById(farm_id);
    if (farm) {
      farmContext = `Farm: ${farm.name}, Area: ${farm.area || 'N/A'} ${farm.area_unit || ''}, Location: ${farm.district || ''}, ${farm.state || ''}`;
    }
  }

  // AI Officer Case Briefing
  const aiBriefing = await generateCaseSummary(description, category, farmContext);

  const caseNumber = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newCase = await db.createCase({
    case_number: caseNumber,
    farmer_id: userId,
    farm_id,
    assigned_officer_id: '00000000-0000-0000-0000-000000000002', // Default to regional officer Dr. Sharma
    category,
    priority: priority || 'MEDIUM',
    description,
    ai_summary: `${aiBriefing.summary} [Urgency: ${aiBriefing.urgency}] Facts: ${aiBriefing.importantFacts.join('; ')}`,
    status: 'OPEN',
  });

  // Notify farmer
  await db.createNotification({
    user_id: userId,
    title: `Case Registered: ${caseNumber}`,
    message: `Your support request for ${category} has been registered and forwarded to the local Agriculture Officer.`,
    type: 'CASE',
  });

  // Audit log
  await db.createAuditLog({
    actor_id: userId,
    action: 'CREATE_CASE',
    entity_type: 'support_case',
    entity_id: newCase.id,
    metadata: { caseNumber, category },
  });

  res.status(201).json(newCase);
}

export async function updateOfficerCase(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, officer_notes, resolution, priority, assigned_officer_id } = req.body;

  const existing = await db.getCaseById(id);
  if (!existing) {
    res.status(404).json({ error: 'Case not found' });
    return;
  }

  const updated = await db.updateCase(id, {
    status: status || existing.status,
    officer_notes: officer_notes !== undefined ? officer_notes : existing.officer_notes,
    resolution: resolution !== undefined ? resolution : existing.resolution,
    priority: priority || existing.priority,
    assigned_officer_id: assigned_officer_id || existing.assigned_officer_id,
  });

  // Notify the farmer about officer update / resolution
  if (status === 'RESOLVED' || resolution) {
    await db.createNotification({
      user_id: existing.farmer_id,
      title: `Case Updated: ${existing.case_number}`,
      message: `Agriculture Officer has provided an assessment/resolution: "${resolution || officer_notes || 'Status updated to ' + status}".`,
      type: 'CASE',
    });
  }

  await db.createAuditLog({
    actor_id: req.user?.id,
    action: 'OFFICER_UPDATE_CASE',
    entity_type: 'support_case',
    entity_id: id,
    metadata: { newStatus: status, hasResolution: Boolean(resolution) },
  });

  res.json(updated);
}
