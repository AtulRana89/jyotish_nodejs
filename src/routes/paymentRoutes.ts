import { Router } from 'express';
import {
  confirmPayment,
  getPaymentHistory,
  handleStripeWebhook
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const paymentConfirmSchema = Joi.object({
  paymentIntentId: Joi.string().required()
});

router.post('/confirm', authenticate, validate(paymentConfirmSchema), confirmPayment);
router.get('/history', authenticate, getPaymentHistory);
router.post('/webhook', handleStripeWebhook); // Raw body needed for webhook

export default router