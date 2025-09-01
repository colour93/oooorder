import { Request } from 'express';
import { User } from '../entities/User';

export const setSessionUser = (req: Request, user: User): void => {
  req.session.userId = user.id;
  req.session.userRole = user.role;
  req.session.emailVerified = user.emailVerified;
};

export const clearSession = (req: Request): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const isAuthenticated = (req: Request): boolean => {
  return !!req.session.userId;
};

export const getSessionUserId = (req: Request): string | undefined => {
  return req.session.userId;
};
