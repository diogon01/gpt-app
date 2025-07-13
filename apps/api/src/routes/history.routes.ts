import { Router } from 'express';
import { getUserHistory } from '../controllers/history.controller';

const router = Router();

router.get('/history', getUserHistory);

export default router;
