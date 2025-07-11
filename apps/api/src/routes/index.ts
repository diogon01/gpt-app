import { Router, Request, Response } from 'express';
import { handleIA } from '../controllers/ia.controller';
import { handleAuthSync } from '../controllers/auth.controller';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

router.post('/ia', handleIA);


router.post('/auth/sync', handleAuthSync);
export default router;