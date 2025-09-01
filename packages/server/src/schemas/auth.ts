import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required'),
  invitationCode: z.string().min(1, 'Invitation code is required'),
  verificationCode: z.string().length(6, 'Verification code must be 6 digits')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

export const sendVerificationEmailSchema = z.object({
  email: z.string().email('Invalid email format')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type SendVerificationEmailInput = z.infer<typeof sendVerificationEmailSchema>;
