import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authRateLimit } from '../middleware/rateLimiter';
import { validate } from '../middleware/validation';
import {
    loginSchema,
    registerSchema,
    sendVerificationEmailSchema,
    verifyEmailSchema
} from '../schemas/auth';

const router = Router();
const authController = new AuthController();

// 注册
router.post('/register', 
  authRateLimit,
  validate(registerSchema),
  authController.register
);

// 登录
router.post('/login',
  authRateLimit,
  validate(loginSchema),
  authController.login
);

// 登出
router.post('/logout', authController.logout);

// 获取当前用户信息
router.get('/me', authController.me);

// 发送验证邮件
router.post('/send-verification',
  authRateLimit,
  validate(sendVerificationEmailSchema),
  authController.sendVerificationEmail
);

// 验证邮箱
router.post('/verify-email',
  authRateLimit,
  validate(verifyEmailSchema),
  authController.verifyEmail
);

export default router;
