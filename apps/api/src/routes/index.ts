import { Router } from 'express';
import { authRouter } from './auth.js';
import { profileRouter } from './profile.js';
import { farmRouter, fieldRouter } from './farms.js';
import { cropRouter } from './crops.js';
import { advisoryRouter } from './advisories.js';
import { chatRouter } from './chat.js';
import { schemeRouter } from './schemes.js';
import { alertRouter } from './alerts.js';
import { caseRouter, officerCaseRouter } from './cases.js';
import { notificationRouter } from './notifications.js';
import { adminRouter } from './admin.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/farms', farmRouter);
apiRouter.use('/fields', fieldRouter);
apiRouter.use('/crops', cropRouter);
apiRouter.use('/advisories', advisoryRouter);
apiRouter.use('/chat', chatRouter);
apiRouter.use('/schemes', schemeRouter);
apiRouter.use('/alerts', alertRouter);
apiRouter.use('/cases', caseRouter);
apiRouter.use('/officer/cases', officerCaseRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/admin', adminRouter);
