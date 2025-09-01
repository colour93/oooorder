import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import 'reflect-metadata';
import { sessionConfig } from './config/session';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';

// 扩展Session类型
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userRole?: string;
    emailVerified?: boolean;
  }
}

const app = express();

// 安全中间件
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// 请求解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session中间件
app.use(session(sessionConfig));

// 请求日志（开发环境）
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API路由
app.use('/api', routes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'OOOrder API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use(notFoundHandler);

// 错误处理中间件
app.use(errorHandler);

export default app;
