import { Router } from 'express';
import { getDashboard } from '../controllers/enterprise.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Routes protégées par authentification
router.use(authenticate);

// Route du tableau de bord
router.get('/dashboard', getDashboard);

export default router; 