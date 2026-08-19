import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { verifyToken } from '../utils/token.js';
import pool from '../utils/db.js';

/**
 * Middleware that requires a valid JWT token in cookies.
 * Attaches the full user object to req.user.
 */
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ status: 'error', message: 'Authentication required. Please log in.' });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ status: 'error', message: 'Invalid or expired token. Please log in again.' });
      return;
    }

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    if (result.rows.length === 0) {
      res.status(401).json({ status: 'error', message: 'User not found.' });
      return;
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Middleware that optionally attaches user if a valid token exists.
 * Does not reject unauthenticated requests.
 */
export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.token;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
        if (result.rows.length > 0) {
          req.user = result.rows[0];
        }
      }
    }

    next();
  } catch {
    next();
  }
}
