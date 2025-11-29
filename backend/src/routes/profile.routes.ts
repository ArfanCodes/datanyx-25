import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAuthToken);

router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);

export default router;
