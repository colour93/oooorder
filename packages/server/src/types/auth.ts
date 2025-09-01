import { User } from '../entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userRole?: string;
    emailVerified?: boolean;
  }
}

export interface AuthResult {
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  invitationCode: string;
  verificationCode: string;
}
