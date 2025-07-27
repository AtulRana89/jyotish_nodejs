export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'github' | 'local';
  providerId: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

export interface LoginResponse {
  success: boolean;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
  purpose: 'password_reset' | 'email_verification';
  expiresAt: Date;
  attempts: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  provider: string;
  iat?: number;
  exp?: number;
}