import jwt from 'jsonwebtoken';
import { JWTPayload, AuthUser } from '../types/user.types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class JWTService {
  static generateAccessToken(user: AuthUser): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '15m' // Short-lived access token
    });
  }

  static generateRefreshToken(user: AuthUser): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_EXPIRES_IN // Long-lived refresh token
    });
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static generateTokenPair(user: AuthUser): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user)
    };
  }
}