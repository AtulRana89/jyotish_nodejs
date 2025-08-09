// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import dotenv from 'dotenv';
// import connectDB from './config/database';
// import routes from './routes';
// import { generalLimiter } from './middleware/rateLimiting';
// import { ApiResponse } from './types';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// // Rate limiting
// app.use(generalLimiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Routes
// app.use('/api', routes);

// // Health check endpoint
// app.get('/health', (req, res) => {
//   const response: ApiResponse<any> = {
//     success: true,
//     message: 'Server is running successfully',
//     data: {
//       timestamp: new Date().toISOString(),
//       environment: process.env.NODE_ENV || 'development'
//     }
//   };
//   res.status(200).json(response);
// });

// // 404 handler
// app.use('*', (req, res) => {
//   const response: ApiResponse<null> = {
//     success: false,
//     message: 'Route not found'
//   };
//   res.status(404).json(response);
// });

// // Global error handler
// app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Global error:', error);
  
//   const response: ApiResponse<null> = {
//     success: false,
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
//   };
  
//   res.status(500).json(response);
// });

// // Connect to database and start server
// const startServer = async () => {
//   try {
//     await connectDB();
    
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📊 Health check: http://localhost:${PORT}/health`);
//       console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer()