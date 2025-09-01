import { NextFunction, Request, Response } from 'express';
import { LoginInput, RegisterInput, SendVerificationEmailInput } from '../schemas/auth';
import { AuthService } from '../services/AuthService';
import { NotificationService } from '../services/NotificationService';
import { clearSession } from '../utils/session';

export class AuthController {
  private authService = new AuthService();
  private notificationService = new NotificationService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: RegisterInput = req.body;
      const user = await this.authService.register(data, req.session);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: LoginInput = req.body;
      const user = await this.authService.login(email, password, req.session);
      
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await clearSession(req);
      res.clearCookie('oooorder.sid');
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await this.authService.getCurrentUser(req.session.userId);
      if (!user) {
        await clearSession(req);
        return res.status(401).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified
      });
    } catch (error) {
      next(error);
    }
  };

  sendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email }: SendVerificationEmailInput = req.body;
      await this.authService.sendVerificationEmail(email);
      
      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      await this.authService.verifyEmail(token);
      
      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
