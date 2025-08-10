import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import connectDB from './config/database';
import astrologerRoutes from './routes/astrologerRoutes';
import bookingRouter from './routes/bookingsRoutes';

// import passport from './config/passport';
// import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 3000;

// ===== CORS Configuration =====
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3001',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ===== Passport (Optional) =====
// app.use(passport.initialize());
// app.use(passport.session());

// ===== Routes =====
// app.use('/auth', authRoutes);

connectDB();

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Node.js + TypeScript API with OAuth Authentication',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    availableRoutes: {
      auth: {
        google: '/auth/google',
        github: '/auth/github',
        profile: '/auth/profile',
        refresh: '/auth/refresh',
        logout: '/auth/logout',
        forgotPassword: '/auth/forgot-password',
        verifyOTP: '/auth/verify-otp',
        resetPassword: '/auth/reset-password'
      }
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ===== 404 handler =====
// FIX: use "(.*)" instead of "*" to avoid path-to-regexp v6 errors
app.use(/.*/, (req: Request, res: Response) => {

  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});


app.use('/api/astrologers', astrologerRoutes);
app.use('/api/bookings', bookingRouter);

// ===== Error handling middleware =====
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
};
app.use(errorHandler);

// ===== Graceful shutdown =====
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});

export default app;
