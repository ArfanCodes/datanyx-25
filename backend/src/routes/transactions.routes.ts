import { Router } from 'express';
import * as transactionController from '../controllers/transactions.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAuthToken);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);

export default router;
