import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { Server } from 'http';

let server: Server;

async function bootstrap() {
  try {
    // 1. Set Mongoose options
    mongoose.set('strictQuery', false);

    // 2. Connect to Database FIRST
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true,
      autoIndex: config.node_env === 'development', // Disable autoIndex in production for performance
    } as mongoose.ConnectOptions);

    console.log("✅ MongoDB Connected Successfully");

    // 3. Start Server only AFTER DB connection is successful
    server = app.listen(config.port, () => {
      console.log(`🚀  Server running on port http://localhost:${config.port}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1); // Exit if DB connection fails on startup
  }
}

bootstrap();

// ============================
// PROCESS HANDLERS
// ============================

// Handle Promise rejections (e.g., failed DB auth after start)
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection Detected:', err);
  if (server) {
    server.close(() => {
      console.log('Server closed due to unhandled rejection.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle synchronous bugs (e.g., calling a function that doesn't exist)
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception Detected:', err);
  process.exit(1);
});

// Graceful shutdown for deployments (Docker/PM2/Render)
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Closing gracefully...');
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log('Cleaned up connections. Process exiting.');
      process.exit(0);
    });
  }
});