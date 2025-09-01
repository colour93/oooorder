import dotenv from 'dotenv';
import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/database';

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 初始化数据库连接
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established successfully');

    // 在开发环境中同步数据库结构
    if (process.env.NODE_ENV === 'development') {
      console.log('Synchronizing database schema...');
      await AppDataSource.synchronize();
      console.log('Database schema synchronized');
    }

    // 启动服务器
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 API documentation available at http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // 优雅关闭
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await AppDataSource.destroy();
          console.log('Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during database shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// 启动服务器
startServer();
