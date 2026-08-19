import { Router } from 'express';
import {
  getMarketIndices,
  getStockQuotes,
  getStockHistory,
} from '../controllers/stocks.controller.js';

const router = Router();

// ─── Stock & Market Routes ───────────────────────────────────────────
router.get('/indices', getMarketIndices);
router.get('/quotes', getStockQuotes);
router.get('/history/:symbol', getStockHistory);

export default router;
