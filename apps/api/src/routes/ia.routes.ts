// src/routes/ia.routes.ts
import { Router } from 'express';
import { handleIA } from '../controllers/ia.controller';

const router = Router();
router.post('/ia/:tipo(art|geo)', handleIA);

export default router;
