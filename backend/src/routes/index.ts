import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import stocksRoutes from './stocks.routes.js';

const router = Router();

// ─── Central API Route Gateway ───────────────────────────────────────
// All routes are prefixed with /api in index.ts

router.use('/auth', authRoutes);     // /api/auth/*
router.use('/users', userRoutes);    // /api/users/*
router.use('/stocks', stocksRoutes);  // /api/stocks/*

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend server is running successfully',
    timestamp: new Date().toISOString(),
  });
});

export default router;
