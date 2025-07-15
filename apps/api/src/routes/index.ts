// apps/api/src/routes/index.ts
import { Request, Response, Router } from 'express';
import { handleAuthSync } from '../controllers/auth.controller';
import { handleIA } from '../controllers/ia.controller';
import historyRoutes from './history.routes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

router.post('/ia', handleIA);

// ✅ Usar as rotas do módulo de histórico
router.use('/history', historyRoutes); // Isso monta /history/*

router.post('/auth/sync', handleAuthSync);

export default router;
