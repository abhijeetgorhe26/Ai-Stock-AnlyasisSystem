import { Response } from 'express';
import pool from '../utils/db.js';
import { AuthRequest } from '../types/index.js';

// ─── Helper: strip sensitive fields ──────────────────────────────────
function sanitizeUser(user: any) {
  const { password_hash, ...safe } = user;
  return safe;
}

// ─── Get User Profile ────────────────────────────────────────────────
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    res.json({
      status: 'success',
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Update User Profile ────────────────────────────────────────────
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, avatar_url } = req.body;
    const userId = req.user!.id;

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (avatar_url) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(avatar_url);
    }

    if (fields.length === 0) {
      res.status(400).json({ status: 'error', message: 'No fields to update.' });
      return;
    }

    values.push(userId);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      status: 'success',
      message: 'Profile updated successfully.',
      user: sanitizeUser(result.rows[0]),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Delete Account ──────────────────────────────────────────────────
export async function deleteAccount(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.clearCookie('token', { httpOnly: true, path: '/' });
    res.json({ status: 'success', message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}
