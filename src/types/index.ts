import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId; // ✅ compatible with Mongoose's Document
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  password?: string;
  role: 'user' | 'astrologer' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAstrologer {
  _id: string;
  userId: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  consultations: number;
  image: string;
  price: number;
  available: boolean;
  bio: string;
  languages: string[];
  timeSlots: ITimeSlot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  _id: string;
  name: string;
  icon: string;
  duration: number; // in minutes
  description: string;
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimeSlot {
  time: string;
  available: boolean;
  date?: Date;
}

export interface IConsultation {
  _id: string;
  userId: string;
  astrologerId: string;
  serviceId: string;
  consultationDate: Date;
  consultationTime: string;
  duration: number;
  question: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  paymentId: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  meetingLink?: string;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  _id: string;
  consultationId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  stripePaymentId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}