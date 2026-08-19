import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from './utils/db.js';
import apiRoutes from './routes/index.js';

import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const app = express();
const port = process.env.PORT || 5001;

// ─── Middleware ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or allowed local origins
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ─── Central API Gateway ─────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── Start server ────────────────────────────────────────────────────
app.listen(port, async () => {
  console.log(`Backend server running on http://localhost:${port}`);
  await initializeDatabase();
});
