import { User, OTPVerification } from '../types/user.types';
import { generateId } from '../utils/helpers';


// In-memory storage (replace with database in production)
const users: User[] = [];
const otpStorage: OTPVerification[] = [];

export class UserService {
  static async findByEmail(email: string): Promise<User | null> {
    return users.find(user => user.email === email) || null;
  }

  static async findById(id: string): Promise<User | null> {
    return users.find(user => user.id === id) || null;
  }

  static async findByProviderId(provider: string, providerId: string): Promise<User | null> {
    return users.find(user => user.provider === provider && user.providerId === providerId) || null;
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    };
    
    users.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    return users[userIndex];
  }

  static async storeOTP(email: string, otp: string, purpose: 'password_reset' | 'email_verification'): Promise<void> {
    // Remove existing OTP for this email and purpose
    const existingIndex = otpStorage.findIndex(item => item.email === email && item.purpose === purpose);
    if (existingIndex !== -1) {
      otpStorage.splice(existingIndex, 1);
    }

    // Store new OTP
    otpStorage.push({
      email,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0
    });
  }

  static async verifyOTP(email: string, otp: string, purpose: 'password_reset' | 'email_verification'): Promise<boolean> {
    const otpRecord = otpStorage.find(item => 
      item.email === email && 
      item.purpose === purpose && 
      item.expiresAt > new Date()
    );

    if (!otpRecord) return false;

    otpRecord.attempts += 1;

    if (otpRecord.attempts > 3) {
      // Remove OTP after 3 failed attempts
      const index = otpStorage.indexOf(otpRecord);
      otpStorage.splice(index, 1);
      return false;
    }

    if (otpRecord.otp === otp) {
      // Remove OTP after successful verification
      const index = otpStorage.indexOf(otpRecord);
      otpStorage.splice(index, 1);
      return true;
    }

    return false;
  }

  static async deleteOTP(email: string, purpose: 'password_reset' | 'email_verification'): Promise<void> {
    const index = otpStorage.findIndex(item => item.email === email && item.purpose === purpose);
    if (index !== -1) {
      otpStorage.splice(index, 1);
    }
  }
}