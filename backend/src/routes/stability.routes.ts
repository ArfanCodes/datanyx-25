import { Router } from 'express';
import * as stabilityController from '../controllers/stability.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAuthToken);

router.get('/', stabilityController.getStability);
router.post('/update', stabilityController.updateStability);

export default router;
