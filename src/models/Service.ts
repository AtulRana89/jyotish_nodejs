import mongoose, { Schema } from 'mongoose';
import { IService } from '../types';

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  icon: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 120
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IService>('Service', serviceSchema);
