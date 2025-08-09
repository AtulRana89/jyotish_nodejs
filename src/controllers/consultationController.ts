// src/controllers/consultationController.ts
import { Request, Response } from 'express';
//import { v4 as uuidv4 } from 'uuid';
import Consultation from '../models/Consultation';
import Astrologer from '../models/Astrologer';
import Service from '../models/Service';
import Payment from '../models/Payment';
import stripe from '../config/stripe';
import { ApiResponse } from '../types';
//import { AuthRequest } from '../middleware/auth';

export const bookConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { astrologerId, serviceId, consultationDate, consultationTime, question } = req.body;

    // Validate astrologer and service
    const [astrologer, service] = await Promise.all([
      Astrologer.findById(astrologerId),
      Service.findById(serviceId)
    ]);

    if (!astrologer || !astrologer.available) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Astrologer not found or unavailable'
      };
      return res.status(404).json(response);
    }

    if (!service || !service.isActive) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Service not found or inactive'
      };
      return res.status(404).json(response);
    }

    // Check time slot availability
    const timeSlot = astrologer.timeSlots.find(slot => 
      slot.time === consultationTime && slot.available
    );

    if (!timeSlot) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Selected time slot is not available'
      };
      return res.status(400).json(response);
    }

    // Calculate amount
    const amount = astrologer.price;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency: 'inr',
      metadata: {
        userId,
        astrologerId,
        serviceId
      }
    });

    // Create consultation
    const consultation = new Consultation({
      userId,
      astrologerId,
      serviceId,
      consultationDate,
      consultationTime,
      duration: service.duration,
      question,
      amount,
      paymentId: paymentIntent.id,
      paymentStatus: 'pending'
    });

    await consultation.save();

    // Create payment record
    const payment = new Payment({
      consultationId: consultation._id,
      userId,
      amount,
      currency: 'INR',
      paymentMethod: 'stripe',
      stripePaymentId: paymentIntent.id,
      status: 'pending'
    });

    await payment.save();

    const response: ApiResponse<any> = {
      success: true,
      message: 'Consultation booking initiated',
      data: {
        consultationId: consultation._id,
        clientSecret: paymentIntent.client_secret,
        amount,
        paymentId: paymentIntent.id
      }
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to book consultation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

export const getUserConsultations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const consultations = await Consultation.find({ userId })
      .populate('astrologerId', 'name specialization image rating')
      .populate('serviceId', 'name icon duration')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Consultation.countDocuments({ userId });

    const response: ApiResponse<any> = {
      success: true,
      message: 'Consultations retrieved successfully',
      data: consultations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      data: null
    };
    res.status(500).json(response);
  }
};
