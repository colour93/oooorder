import { Router } from 'express';
import { apiRateLimit } from '../middleware/rateLimiter';
import authRoutes from './auth';
import orderRoutes from './orders';

const router = Router();

// 应用全局API限流
router.use(apiRateLimit);

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API版本信息
router.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    name: 'OOOrder API',
    description: 'Order collection and management system'
  });
});

// 路由模块
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);

export default router;
