import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

// Redis客户端（可选，用于生产环境）
let redisClient: any;

if (process.env.NODE_ENV === 'production' && process.env.REDIS_HOST) {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    password: process.env.REDIS_PASSWORD || undefined
  });

  redisClient.on('error', (err: any) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.connect();
}

export const sessionConfig: session.SessionOptions = {
  name: 'oooorder.sid',
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: redisClient 
    ? new RedisStore({ client: redisClient })
    : undefined, // 开发环境使用内存存储
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800000'), // 7 days
    sameSite: 'lax'
  }
};
