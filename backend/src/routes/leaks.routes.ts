import { Router } from 'express';
import * as leaksController from '../controllers/leaks.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAuthToken);

router.post('/analyze', leaksController.analyzeLeaks);
router.get('/', leaksController.getLeaks);

export default router;
