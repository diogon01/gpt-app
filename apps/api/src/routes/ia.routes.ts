// src/routes/ia.routes.ts
import express, { Router } from 'express';
import { handleIA } from '../controllers/ia.controller';

const router: Router = express.Router();
router.post('/ia/:tipo(art|geo)', handleIA);

export default router;
