// import { Request, Response, NextFunction } from 'express';

// import { ApiResponse } from '../types';
// import Consultation from '../models/Consultation';
// import { error } from 'console';
// import stripe from '../config/stripe';
// import Payment from '../models/Payment';
// import Astrologer from '../models/Astrologer';

// export interface AuthRequest extends Request {
//   user?: any;
// }

// export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       const response: ApiResponse<null> = {
//       success: false,
//       message: 'Failed to retrieve consultations',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//     res.status(500).json(response);
//   }
// };

// export const getConsultationById = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;

//     const consultation = await Consultation.findOne({ _id: id, userId })
//       .populate('astrologerId', 'name specialization image rating experience')
//       .populate('serviceId', 'name icon duration description');

//     if (!consultation) {
//       const response: ApiResponse<null> = {
//         success: false,
//         message: 'Consultation not found'
//       };
//       return res.status(404).json(response);
//     }

//     const response: ApiResponse<any> = {
//       success: true,
//       message: 'Consultation retrieved successfully',
//       data: consultation
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     const response: ApiResponse<null> = {
//       success: false,
//       message: 'Failed to retrieve consultation',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//     res.status(500).json(response);
//   }
// };

// export const cancelConsultation = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;

//     const consultation = await Consultation.findOne({ _id: id, userId });

//     if (!consultation) {
//       const response: ApiResponse<null> = {
//         success: false,
//         message: 'Consultation not found'
//       };
//       return res.status(404).json(response);
//     }

//     if (consultation.status !== 'pending') {
//       const response: ApiResponse<null> = {
//         success: false,
//         message: 'Cannot cancel consultation that is not pending'
//       };
//       return res.status(400).json(response);
//     }

//     // Check if cancellation is allowed (24 hours before)
//     const consultationDateTime = new Date(`${consultation.consultationDate} ${consultation.consultationTime}`);
//     const now = new Date();
//     const timeDiff = consultationDateTime.getTime() - now.getTime();
//     const hoursDiff = timeDiff / (1000 * 3600);

//     if (hoursDiff < 24) {
//       const response: ApiResponse<null> = {
//         success: false,
//         message: 'Cannot cancel consultation less than 24 hours before scheduled time'
//       };
//       return res.status(400).json(response);
//     }

//     // Update consultation status
//     consultation.status = 'cancelled';
//     await consultation.save();

//     // Process refund if payment was made
//     if (consultation.paymentStatus === 'paid') {
//       try {
//         await stripe.refunds.create({
//           payment_intent: consultation.paymentId,
//         });

//         consultation.paymentStatus = 'refunded';
//         await consultation.save();

//         // Update payment record
//         await Payment.findOneAndUpdate(
//           { consultationId: consultation._id },
//           { status: 'refunded' }
//         );
//       } catch (stripeError) {
//         console.error('Refund failed:', stripeError);
//       }
//     }

//     const response: ApiResponse<any> = {
//       success: true,
//       message: 'Consultation cancelled successfully',
//       data: consultation
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     const response: ApiResponse<null> = {
//       success: false,
//       message: 'Failed to cancel consultation',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//     res.status(500).json(response);
//   }
// };

// export const addConsultationReview = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { rating, review } = req.body;
//     const userId = req.user._id;

//     const consultation = await Consultation.findOne({ _id: id, userId });

//     if (!consultation) {
//       const response: ApiResponse<null> = {
//         success: false,
//         message: 'Consultation not found'
//       };
//       return res.status(404).json(response);
//     }

//     if (consultation.status !== 'completed') {
//       const response: ApiResponse<null> = {
//         success: false,
//         message: 'Can only review completed consultations'
//       };
//       return res.status(400).json(response);
//     }

//     consultation.rating = rating;
//     consultation.review = review;
//     await consultation.save();

//     // Update astrologer's average rating
//     const astrologer = await Astrologer.findById(consultation.astrologerId);
//     if (astrologer) {
//       const consultations = await Consultation.find({
//         astrologerId: consultation.astrologerId,
//         rating: { $exists: true }
//       });

//       const avgRating = consultations.reduce((sum, c) => sum + (c.rating || 0), 0) / consultations.length;
//       astrologer.rating = Number(avgRating.toFixed(1));
//       await astrologer.save();
//     }

//     const response: ApiResponse<any> = {
//       success: true,
//       message: 'Review added successfully',
//       data: consultation
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     const response: ApiResponse<null> = {
//       success: false,
//       message: 'Failed to add review',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//     res.status(500).json(response);
//   }
// };