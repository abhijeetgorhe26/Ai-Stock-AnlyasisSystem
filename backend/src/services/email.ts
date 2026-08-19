import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.SMTP_USER || 'noreply@aitrade.com';

/**
 * Send email verification link
 */
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"AITrade" <${FROM_EMAIL}>`,
    to: email,
    subject: 'Verify your AITrade account',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e; font-size: 28px; margin: 0;">📈 AITrade</h1>
        </div>
        <div style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <h2 style="color: #1a1a2e; margin-top: 0;">Verify your email address</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Welcome to AITrade! Click the button below to verify your email and start investing smartly with AI-driven insights.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #3b82f6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #888; font-size: 13px;">
            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"AITrade" <${FROM_EMAIL}>`,
    to: email,
    subject: 'Reset your AITrade password',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e; font-size: 28px; margin: 0;">📈 AITrade</h1>
        </div>
        <div style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <h2 style="color: #1a1a2e; margin-top: 0;">Reset your password</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #3b82f6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #888; font-size: 13px;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
