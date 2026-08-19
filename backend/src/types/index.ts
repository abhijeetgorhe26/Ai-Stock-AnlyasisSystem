import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  name: string;
  is_verified: boolean;
  google_id: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface VerificationToken {
  id: string;
  user_id: string;
  token: string;
  type: 'email_verify' | 'password_reset';
  expires_at: Date;
  created_at: Date;
}
