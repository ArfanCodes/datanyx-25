import { Router } from 'express';
import { OnboardingController } from '../controllers/onboarding.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { onboardingSchema } from '../utils/validators';

const router = Router();
const onboardingController = new OnboardingController();

router.post('/', authenticate, validate(onboardingSchema), onboardingController.complete);
router.get('/', authenticate, onboardingController.getProfile);
router.put('/', authenticate, validate(onboardingSchema), onboardingController.update);

export default router;
