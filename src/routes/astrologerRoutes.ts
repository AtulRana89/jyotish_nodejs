import { Router } from 'express';
import {
  getAllAstrologers,
  getAstrologerById,
  getAstrologerTimeSlots
} from '../controllers/astrologerController';

const router = Router();

router.get('/', getAllAstrologers);
router.get('/:id', getAstrologerById);
router.get('/:id/timeslots', getAstrologerTimeSlots);

export default router;