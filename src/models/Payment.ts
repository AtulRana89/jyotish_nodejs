import mongoose, { Schema } from 'mongoose';
import { IPayment } from '../types';

const paymentSchema = new Schema<IPayment>({
  consultationId: {
    type: String,
    required: true,
    ref: 'Consultation'
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  stripePaymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model<IPayment>('Payment', paymentSchema);