import { NextFunction, Request, Response } from 'express';

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVITATION_CODE_INVALID = 'INVITATION_CODE_INVALID',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  ORDER_LIMIT_EXCEEDED = 'ORDER_LIMIT_EXCEEDED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code,
      message: error.message
    });
  }

  // TypeORM错误处理
  if (error.name === 'QueryFailedError') {
    const queryError = error as any;
    
    // 唯一约束违反
    if (queryError.code === '23505') {
      return res.status(409).json({
        error: 'CONFLICT',
        message: 'Resource already exists'
      });
    }
    
    // 外键约束违反
    if (queryError.code === '23503') {
      return res.status(400).json({
        error: 'FOREIGN_KEY_VIOLATION',
        message: 'Referenced resource does not exist'
      });
    }
  }

  // 默认错误响应
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  });
};
