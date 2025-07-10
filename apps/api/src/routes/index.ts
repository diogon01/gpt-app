import { Router, Request, Response } from 'express';
import { handleIA } from '../controllers/ia.controller';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

router.post('/ia', handleIA);

export default router;