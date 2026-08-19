import { Response } from 'express';
import bcrypt from 'bcrypt';
import { google } from 'googleapis';
import pool from '../utils/db.js';
import { AuthRequest } from '../types/index.js';
import { generateToken, setTokenCookie, clearTokenCookie, generateRandomToken } from '../utils/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';

const SALT_ROUNDS = 12;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Helper: strip sensitive fields from user ────────────────────────
function sanitizeUser(user: any) {
  const { password_hash, ...safe } = user;
  return safe;
}

// ─── Register ────────────────────────────────────────────────────────
export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ status: 'error', message: 'Email, password, and name are required.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ status: 'error', message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
      [email.toLowerCase(), passwordHash, name]
    );
    const user = result.rows[0];

    const verifyToken = generateRandomToken();
    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'24 hours\')',
      [user.id, verifyToken, 'email_verify']
    );

    sendVerificationEmail(email, verifyToken).catch((err) => {
      console.error('Failed to send verification email:', err);
    });

    const token = generateToken({ userId: user.id, email: user.email });
    setTokenCookie(res, token);

    res.status(201).json({
      status: 'success',
      message: 'Account created. Please check your email to verify your account.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Login ───────────────────────────────────────────────────────────
export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: 'error', message: 'Email and password are required.' });
      return;
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      return;
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      res.status(401).json({ status: 'error', message: 'This account uses Google sign-in. Please use "Continue with Google".' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      return;
    }

    if (!user.is_verified) {
      res.status(403).json({ status: 'error', message: 'Please verify your email before logging in.' });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email});
    setTokenCookie(res, token);

    res.json({
      status: 'success',
      message: 'Logged in successfully.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Logout ──────────────────────────────────────────────────────────
export function logout(req: AuthRequest, res: Response): void {
  clearTokenCookie(res);
  res.json({ status: 'success', message: 'Logged out successfully.' });
}

// ─── Get Current User ────────────────────────────────────────────────
export function getMe(req: AuthRequest, res: Response): void {
  res.json({
    status: 'success',
    user: sanitizeUser(req.user),
  });
}

// ─── Verify Email ────────────────────────────────────────────────────
export async function verifyEmail(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ status: 'error', message: 'Verification token is required.' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM verification_tokens WHERE token = $1 AND type = $2 AND expires_at > NOW()',
      [token, 'email_verify']
    );

    if (result.rows.length === 0) {
      res.status(400).json({ status: 'error', message: 'Invalid or expired verification token.' });
      return;
    }

    const verificationToken = result.rows[0];
    await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [verificationToken.user_id]);
    await pool.query('DELETE FROM verification_tokens WHERE id = $1', [verificationToken.id]);

    res.json({ status: 'success', message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Resend Verification ────────────────────────────────────────────
export async function resendVerification(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ status: 'error', message: 'Email is required.' });
      return;
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      res.json({ status: 'success', message: 'If an account exists, a verification email has been sent.' });
      return;
    }

    const user = result.rows[0];

    if (user.is_verified) {
      res.status(400).json({ status: 'error', message: 'This email is already verified.' });
      return;
    }

    await pool.query('DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2', [user.id, 'email_verify']);

    const verifyToken = generateRandomToken();
    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'24 hours\')',
      [user.id, verifyToken, 'email_verify']
    );

    sendVerificationEmail(email, verifyToken).catch((err) => {
      console.error('Failed to send verification email:', err);
    });

    res.json({ status: 'success', message: 'If an account exists, a verification email has been sent.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Forgot Password ────────────────────────────────────────────────
export async function forgotPassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ status: 'error', message: 'Email is required.' });
      return;
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);

    if (result.rows.length === 0) {
      res.json({ status: 'success', message: 'If an account exists, a password reset email has been sent.' });
      return;
    }

    const user = result.rows[0];
    await pool.query('DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2', [user.id, 'password_reset']);

    const resetToken = generateRandomToken();
    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'1 hour\')',
      [user.id, resetToken, 'password_reset']
    );

    sendPasswordResetEmail(email, resetToken).catch((err) => {
      console.error('Failed to send password reset email:', err);
    });

    res.json({ status: 'success', message: 'If an account exists, a password reset email has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Reset Password ─────────────────────────────────────────────────
export async function resetPassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ status: 'error', message: 'Token and new password are required.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM verification_tokens WHERE token = $1 AND type = $2 AND expires_at > NOW()',
      [token, 'password_reset']
    );

    if (result.rows.length === 0) {
      res.status(400).json({ status: 'error', message: 'Invalid or expired reset token.' });
      return;
    }

    const resetToken = result.rows[0];
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, resetToken.user_id]);
    await pool.query('DELETE FROM verification_tokens WHERE id = $1', [resetToken.id]);

    res.json({ status: 'success', message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

// ─── Google OAuth Redirect ──────────────────────────────────────────
export function googleAuth(req: AuthRequest, res: Response): void {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent',
  });

  res.redirect(authUrl);
}

// ─── Google OAuth Callback ──────────────────────────────────────────
export async function googleCallback(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { code } = req.query;

    if (!code) {
      res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    if (!googleUser.email) {
      res.redirect(`${FRONTEND_URL}/login?error=google_no_email`);
      return;
    }

    let user;
    const existingByGoogleId = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleUser.id]);

    if (existingByGoogleId.rows.length > 0) {
      user = existingByGoogleId.rows[0];
      await pool.query(
        'UPDATE users SET name = $1, avatar_url = $2 WHERE id = $3',
        [googleUser.name || user.name, googleUser.picture || user.avatar_url, user.id]
      );
      user.name = googleUser.name || user.name;
      user.avatar_url = googleUser.picture || user.avatar_url;
    } else {
      const existingByEmail = await pool.query('SELECT * FROM users WHERE email = $1', [googleUser.email.toLowerCase()]);

      if (existingByEmail.rows.length > 0) {
        user = existingByEmail.rows[0];
        await pool.query(
          'UPDATE users SET google_id = $1, is_verified = TRUE, avatar_url = COALESCE(avatar_url, $2) WHERE id = $3',
          [googleUser.id, googleUser.picture, user.id]
        );
        user.is_verified = true;
      } else {
        const result = await pool.query(
          'INSERT INTO users (email, name, google_id, is_verified, avatar_url) VALUES ($1, $2, $3, TRUE, $4) RETURNING *',
          [googleUser.email.toLowerCase(), googleUser.name || 'User', googleUser.id, googleUser.picture]
        );
        user = result.rows[0];
      }
    }

    const jwtToken = generateToken({ userId: user.id, email: user.email });
    setTokenCookie(res, jwtToken);

    res.redirect(`${FRONTEND_URL}/`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
  }
}
