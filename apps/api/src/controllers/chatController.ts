import { Request, Response } from 'express';
import { db } from '../repositories/db.js';
import { generateChatTurn } from '../ai/gemini.js';

export async function listChatSessions(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const sessions = await db.listChatSessionsByUser(userId);
  res.json(sessions);
}

export async function createChatSession(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const session = await db.createChatSession(userId, req.body.title);
  res.status(201).json(session);
}

export async function getChatSession(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const session = await db.getChatSessionById(id, userId);
  if (!session) {
    res.status(404).json({ error: 'Chat session not found' });
    return;
  }

  const messages = await db.listChatMessagesBySession(id);
  res.json({ session, messages });
}

export async function deleteChatSession(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const success = await db.deleteChatSession(id, userId);
  if (!success) {
    res.status(404).json({ error: 'Chat session not found' });
    return;
  }

  res.json({ success: true });
}

export async function sendChatMessage(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { id: sessionId } = req.params;
  const { content, farmId, cropName } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const session = await db.getChatSessionById(sessionId, userId);
  if (!session) {
    res.status(404).json({ error: 'Chat session not found' });
    return;
  }

  // Record User Message
  await db.createChatMessage({
    session_id: sessionId,
    role: 'USER',
    content,
    metadata: { farmId, cropName },
  });

  // Fetch recent message history
  const previousMessages = await db.listChatMessagesBySession(sessionId);
  const historyForAi = previousMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Fetch farmer context
  const profile = await db.getProfileById(userId);
  const farmerContext = {
    name: profile?.full_name,
    location: `${profile?.district || ''}, ${profile?.state || ''}`,
    crops: cropName ? [cropName] : ['Wheat', 'Rice'],
  };

  // Generate AI Response
  const aiResult = await generateChatTurn(historyForAi, content, farmerContext);

  // Record Assistant Message
  const assistantMessage = await db.createChatMessage({
    session_id: sessionId,
    role: 'ASSISTANT',
    content: aiResult.answer,
    metadata: {
      keyPoints: aiResult.keyPoints,
      followUpQuestions: aiResult.followUpQuestions,
      professionalReviewRecommended: aiResult.professionalReviewRecommended,
    },
  });

  res.json({
    message: assistantMessage,
    structuredResult: aiResult,
  });
}
