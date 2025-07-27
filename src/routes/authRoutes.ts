import { Router } from 'express';
import passport from '../config/passport';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// OAuth Routes
// Google OAuth
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/failure',
    session: false 
  }),
  AuthController.oauthSuccess
);

// GitHub OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/auth/failure',
    session: false 
  }),
  AuthController.oauthSuccess
);

// OAuth callback routes
router.get('/success', AuthController.oauthSuccess);
router.get('/failure', AuthController.oauthFailure);

// JWT Token Management
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

// User Profile
router.get('/profile', authenticateToken, AuthController.getProfile);

// Password Reset Flow
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/reset-password', AuthController.resetPassword);

// Test route for checking authentication status
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Authenticated user',
    user: req.jwtUser
  });
});

export default router;