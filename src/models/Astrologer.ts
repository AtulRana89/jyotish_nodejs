
import mongoose, { Schema } from 'mongoose';
import { IAstrologer } from '../types';

const timeSlotSchema = new Schema({
  time: { type: String, required: true },
  available: { type: Boolean, default: true },
  date: { type: Date }
}, { _id: false });

const astrologerSchema = new Schema<IAstrologer>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  consultations: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    default: '',
    maxlength: 1000
  },
  languages: [{
    type: String,
    trim: true
  }],
  timeSlots: [timeSlotSchema]
}, {
  timestamps: true
});

export default mongoose.model<IAstrologer>('Astrologer', astrologerSchema);