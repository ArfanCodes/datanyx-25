import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.get('/', authenticate, dashboardController.getSummary);
router.get('/stats', authenticate, dashboardController.getStats);

export default router;
