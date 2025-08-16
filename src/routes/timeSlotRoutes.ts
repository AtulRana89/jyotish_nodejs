// routes/astrologer.routes.ts
import { Router } from 'express';
import { getBookedTimeSlotsByDate } from '../controllers/timeSlot';


const timeSlotRoutes = Router();

// GET /api/astrologers/:id/timeslots?date=YYYY-MM-DD
timeSlotRoutes.get('/:id/timeslots', getBookedTimeSlotsByDate);

export default timeSlotRoutes;
