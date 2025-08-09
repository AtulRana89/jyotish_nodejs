import { Router } from 'express';
import {
  bookConsultation,
  getUserConsultations,
  getConsultationById,
  cancelConsultation,
  addConsultationReview
} from '../controllers/consultationController';
//import { authenticate } from '../middleware/auth';
import { validate, consultationBookingSchema } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().max(1000).optional()
});

router.post('/',  validate(consultationBookingSchema), bookConsultation);
router.get('/',  getUserConsultations);
router.get('/:id', getConsultationById);
router.put('/:id/cancel',  cancelConsultation);
router.post('/:id/review', validate(reviewSchema), addConsultationReview);

export default router