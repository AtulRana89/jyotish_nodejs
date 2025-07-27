import crypto from 'crypto';
import { AuthUser, User } from '../types/user.types';

export const generateId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const userToAuthUser = (user: User): AuthUser => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    provider: user.provider
  };
};

export const sendEmail = async (to: string, subject: string, text: string): Promise<boolean> => {
  // Mock email service - replace with actual email service (SendGrid, AWS SES, etc.)
  console.log(`📧 Email sent to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};