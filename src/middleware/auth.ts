import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../utils/jwt';
import { UserService } from '../services/userService';
import { JWTPayload } from '../types/user.types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = JWTService.verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired access token'
      });
    }

    // Verify user still exists
    const user = await UserService.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = JWTService.verifyAccessToken(token);
      if (decoded) {
        const user = await UserService.findById(decoded.userId);
        if (user) {
          req.user = decoded;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};