import mongoose, { Schema } from 'mongoose';
import { IConsultation } from '../types';

const consultationSchema = new Schema<IConsultation>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  astrologerId: {
    type: String,
    required: true,
    ref: 'Astrologer'
  },
  serviceId: {
    type: String,
    required: true,
    ref: 'Service'
  },
  consultationDate: {
    type: Date,
    required: true
  },
  consultationTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

export default mongoose.model<IConsultation>('Consultation', consultationSchema);