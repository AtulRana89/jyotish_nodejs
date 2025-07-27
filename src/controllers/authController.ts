import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { JWTService } from '../utils/jwt';
import { generateOTP, sendEmail, userToAuthUser } from '../utils/helpers';
import { User } from '../types/user.types';

export class AuthController {
  // OAuth Success Callback
  static async oauthSuccess(req: Request, res: Response) {
    try {
      const user = req.user as User;
      
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
      }

      const authUser = userToAuthUser(user);
      const { accessToken, refreshToken } = JWTService.generateTokenPair(authUser);

      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to client with access token
      return res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(authUser))}`);
    } catch (error) {
      console.error('OAuth success error:', error);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
  }

  // OAuth Failure Callback
  static async oauthFailure(req: Request, res: Response) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }

  // Logout
  static async logout(req: Request, res: Response) {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Refresh Access Token
  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not found'
        });
      }

      const decoded = JWTService.verifyRefreshToken(refreshToken);
      
      if (!decoded) {
        res.clearCookie('refreshToken');
        return res.status(403).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Verify user still exists
      const user = await UserService.findById(decoded.userId);
      if (!user) {
        res.clearCookie('refreshToken');
        return res.status(403).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      const authUser = userToAuthUser(user);
      const newAccessToken = JWTService.generateAccessToken(authUser);

      res.json({
        success: true,
        accessToken: newAccessToken,
        user: authUser
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Token refresh failed'
      });
    }
  }

  // Get Current User Profile
  static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await UserService.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: userToAuthUser(user)
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile'
      });
    }
  }

  // Forgot Password - Send OTP
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const user = await UserService.findByEmail(email);
      
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If the email exists, you will receive a password reset OTP'
        });
      }

      const otp = generateOTP();
      await UserService.storeOTP(email, otp, 'password_reset');

      // Send OTP email
      await sendEmail(
        email,
        'Password Reset OTP',
        `Your password reset OTP is: ${otp}. This OTP will expire in 10 minutes.`
      );

      res.json({
        success: true,
        message: 'Password reset OTP sent to your email'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset OTP'
      });
    }
  }

  // Verify OTP
  static async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp, purpose = 'password_reset' } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required'
        });
      }

      const isValid = await UserService.verifyOTP(email, otp, purpose);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'OTP verification failed'
      });
    }
  }

  // Reset Password (after OTP verification)
  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, purpose = 'password_reset' } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required for password reset'
        });
      }

      // Verify OTP first
      const isValidOTP = await UserService.verifyOTP(email, otp, purpose);

      if (!isValidOTP) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      const user = await UserService.findByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // For OAuth users, we might want to handle this differently
      // Since they don't have passwords, we could send them instructions
      // to reset via their OAuth provider or set up a local password

      res.json({
        success: true,
        message: 'Password can be reset. Please follow the instructions sent to your email.',
        note: 'For OAuth users, please use your OAuth provider to manage your account'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed'
      });
    }
  }
}