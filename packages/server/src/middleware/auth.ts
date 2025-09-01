import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { UserRole } from '../types/common';

const userRepository = AppDataSource.getRepository(User);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Session验证
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // 从数据库获取用户信息
    const user = await userRepository.findOne({ where: { id: req.session.userId } });
    if (!user) {
      req.session.destroy((err) => {
        console.error('Session destroy error:', err);
      });
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 可选认证，不强制要求登录
    if (req.session.userId) {
      const user = await userRepository.findOne({ where: { id: req.session.userId } });
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // 继续执行，不阻止请求
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const adminMiddleware = requireRole([UserRole.ADMIN]);

export const staffMiddleware = requireRole([UserRole.STAFF, UserRole.ADMIN]);

export const resourceOwnerGuard = async (req: Request, res: Response, next: NextFunction) => {
  // 检查用户是否拥有资源访问权限
  // 例如：用户只能访问自己的订单
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // 如果是管理员，允许访问所有资源
  if (req.user.role === UserRole.ADMIN) {
    return next();
  }

  // 对于普通用户，检查资源所有权
  const userId = req.params.userId || req.query.userId;
  if (userId && userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};
