import { Router } from 'express';
import {
  listChatSessions,
  createChatSession,
  getChatSession,
  deleteChatSession,
  sendChatMessage,
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { chatSessionCreateSchema, chatMessageCreateSchema } from '../schemas/index.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

export const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get('/sessions', listChatSessions);
chatRouter.post('/sessions', validateBody(chatSessionCreateSchema), createChatSession);
chatRouter.get('/sessions/:id', getChatSession);
chatRouter.delete('/sessions/:id', deleteChatSession);
chatRouter.post('/sessions/:id/messages', aiRateLimiter, validateBody(chatMessageCreateSchema), sendChatMessage);
