import { Request, Response, Router } from 'express';
import { handleAuthSync } from '../controllers/auth.controller';
import { getUserHistory } from '../controllers/history.controller';
import { handleIA } from '../controllers/ia.controller';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

router.post('/ia', handleIA);

router.get('/history', getUserHistory);


router.post('/auth/sync', handleAuthSync);
export default router;

