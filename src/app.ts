import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import globalErrorHandler from './middleware/GlobalErrorHandler';
import notFound from './middleware/notFund'; 
import routerV1 from './routers/v1';
import config from './config';

const app: Application = express();

// ============================
// MIDDLEWARES
// ============================

// Security headers
app.use(helmet());

// Logging for development
if (config.node_env === 'development') {
  app.use(morgan('dev'));
}

// Optimization & Parsers
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    config.frontend_url as string // Dynamically allow your production frontend
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added to support form-data
app.use(cookieParser());

// ============================
// ROUTES
// ============================

// API v1 routes
app.use('/api/v1', routerV1);

/**
 * Root Route / Health Check
 * Detailed system status for monitoring
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Code Biruni API - System is Live",
    data: {
      version: "1.0.0",
      status: "Operational",
      environment: config.node_env,
      client_info: {
        ip: req.ip,
        method: req.method,
        secure: req.secure,
        user_agent: req.headers['user-agent'],
      },
      server_time: new Date().toISOString(),
      uptime: process.uptime().toFixed(2) + "s",
    }
  });
});

// ============================
// ERROR HANDLING
// ============================

// Global Error Handler (Order matters - must be after routes)
app.use(globalErrorHandler);

// Not Found Handler
app.use(notFound);

export default app;