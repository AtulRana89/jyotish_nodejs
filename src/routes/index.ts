import { Router } from 'express';
//import authRoutes from './authRoutes';
import astrologerRoutes from './astrologerRoutes';
//import serviceRoutes from './serviceRoutes';
import consultationRoutes from './consultationRoutes';
import paymentRoutes from './paymentRoutes';

const router = Router();

//router.use('/auth', authRoutes);
router.use('/astrologers', astrologerRoutes);
//router.use('/services', serviceRoutes);
router.use('/consultations', consultationRoutes);
router.use('/payments', paymentRoutes);

export default router;
