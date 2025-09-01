# 后端架构设计

## 技术栈
- **语言**: TypeScript
- **框架**: Express.js
- **ORM**: TypeORM
- **数据库**: PostgreSQL
- **验证**: Zod
- **认证**: Express Session + Email验证
- **会话存储**: Redis/PostgreSQL

## 项目结构

```
packages/server/
├── src/
│   ├── app.ts                 # Express应用入口
│   ├── server.ts             # 服务器启动文件
│   ├── config/               # 配置文件
│   │   ├── database.ts       # 数据库配置
│   │   ├── session.ts        # Session配置
│   │   └── email.ts         # 邮件配置
│   ├── entities/            # TypeORM实体
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── ProductSKU.ts
│   │   ├── Material.ts
│   │   ├── SKUMaterial.ts
│   │   ├── Equipment.ts
│   │   ├── Staff.ts
│   │   ├── ProductionBatch.ts
│   │   ├── ProductItem.ts
│   │   ├── CollectionBatch.ts
│   │   ├── InvitationCode.ts
│   │   ├── Order.ts
│   │   ├── OrderItem.ts
│   │   └── OrderStatusLog.ts
│   ├── controllers/         # 控制器
│   │   ├── AuthController.ts
│   │   ├── ProductController.ts
│   │   ├── MaterialController.ts
│   │   ├── ManufacturerController.ts
│   │   ├── CollectionController.ts
│   │   ├── OrderController.ts
│   │   └── AdminController.ts
│   ├── services/           # 业务逻辑服务
│   │   ├── AuthService.ts
│   │   ├── ProductService.ts
│   │   ├── MaterialService.ts
│   │   ├── ManufacturerService.ts
│   │   ├── CollectionService.ts
│   │   ├── OrderService.ts
│   │   ├── EmailService.ts
│   │   ├── QRCodeService.ts
│   │   └── NotificationService.ts
│   ├── middleware/         # 中间件
│   │   ├── auth.ts        # 认证中间件
│   │   ├── admin.ts       # 管理员权限中间件
│   │   ├── validation.ts  # 数据验证中间件
│   │   ├── errorHandler.ts # 错误处理中间件
│   │   └── rateLimiter.ts # 限流中间件
│   ├── routes/            # 路由定义
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── materials.ts
│   │   ├── manufacturers.ts
│   │   ├── collections.ts
│   │   ├── orders.ts
│   │   └── admin.ts
│   ├── schemas/           # Zod验证模式
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── material.ts
│   │   ├── manufacturer.ts
│   │   ├── collection.ts
│   │   └── order.ts
│   ├── types/             # TypeScript类型定义
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   └── common.ts
│   └── utils/             # 工具函数
│       ├── session.ts
│       ├── email.ts
│       ├── qrcode.ts
│       └── validation.ts
├── migrations/            # 数据库迁移文件
├── package.json
├── tsconfig.json
└── .env.example
```

## API 路由设计

### 认证路由 `/api/auth`
```typescript
POST   /api/auth/register          # 用户注册（通过邀请码）
POST   /api/auth/login             # 用户登录
POST   /api/auth/verify-email      # 邮箱验证
GET    /api/auth/me                # 获取当前用户信息
POST   /api/auth/logout            # 登出
```

### 商品管理 `/api/products`
```typescript
GET    /api/products               # 获取商品列表
GET    /api/products/:id           # 获取商品详情
GET    /api/products/:id/skus      # 获取商品SKU列表
GET    /api/products/skus/:skuId   # 获取SKU详情

# 管理员接口
POST   /api/products               # 创建商品
PUT    /api/products/:id           # 更新商品
DELETE /api/products/:id           # 删除商品
POST   /api/products/:id/skus      # 创建SKU
PUT    /api/products/skus/:skuId   # 更新SKU
DELETE /api/products/skus/:skuId   # 删除SKU
```

### 原料管理 `/api/materials`
```typescript
GET    /api/materials              # 获取原料列表
GET    /api/materials/:id          # 获取原料详情

# 管理员接口
POST   /api/materials              # 创建原料
PUT    /api/materials/:id          # 更新原料
DELETE /api/materials/:id          # 删除原料
POST   /api/materials/calculate    # 计算采购原料数量
```

### 制造商管理 `/api/manufacturers`
```typescript
# 设备管理
GET    /api/manufacturers/equipment        # 获取设备列表
POST   /api/manufacturers/equipment        # 创建设备
PUT    /api/manufacturers/equipment/:id    # 更新设备
DELETE /api/manufacturers/equipment/:id    # 删除设备

# 人员管理
GET    /api/manufacturers/staff            # 获取人员列表
POST   /api/manufacturers/staff            # 创建人员
PUT    /api/manufacturers/staff/:id        # 更新人员
DELETE /api/manufacturers/staff/:id        # 删除人员

# 生产批次管理
GET    /api/manufacturers/batches          # 获取生产批次列表
POST   /api/manufacturers/batches          # 创建生产批次
PUT    /api/manufacturers/batches/:id      # 更新生产批次
GET    /api/manufacturers/batches/:id/qr   # 获取批次二维码
POST   /api/manufacturers/batches/:id/scan # 扫描批次二维码
POST   /api/manufacturers/batches/:id/items # 生成产品项目

# 产品项目管理
GET    /api/manufacturers/items            # 获取产品项目列表
POST   /api/manufacturers/items/:id/scan   # 扫描产品项目二维码
PUT    /api/manufacturers/items/:id/package # 包装产品项目
```

### 采集管理 `/api/collections`
```typescript
GET    /api/collections/batches            # 获取采集批次列表
POST   /api/collections/batches            # 创建采集批次
PUT    /api/collections/batches/:id        # 更新采集批次

GET    /api/collections/codes              # 获取邀请码列表
POST   /api/collections/codes              # 创建邀请码
GET    /api/collections/codes/:code        # 验证邀请码
PUT    /api/collections/codes/:id          # 更新邀请码状态
```

### 订单管理 `/api/orders`
```typescript
GET    /api/orders                 # 获取订单列表（用户）
GET    /api/orders/:id             # 获取订单详情
POST   /api/orders                 # 创建订单
GET    /api/orders/:id/status      # 获取订单状态历史

# 管理员接口
GET    /api/orders/admin           # 获取所有订单（管理员）
PUT    /api/orders/:id/status      # 更新订单状态
POST   /api/orders/:id/ship        # 发货
```

### 管理后台 `/api/admin`
```typescript
GET    /api/admin/dashboard        # 仪表板数据
GET    /api/admin/statistics       # 统计数据
GET    /api/admin/reports          # 报表数据
```

## 中间件设计

### 认证中间件 (auth.ts)
```typescript
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Session验证
  // 检查req.session.userId
  // 用户信息注入到req.user
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // 从数据库获取用户信息
  const user = await userRepository.findOne({ where: { id: req.session.userId } });
  if (!user) {
    req.session.destroy((err) => {});
    return res.status(401).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  // 可选认证，不强制要求登录
  if (req.session.userId) {
    const user = await userRepository.findOne({ where: { id: req.session.userId } });
    if (user) {
      req.user = user;
    }
  }
  next();
}
```

### 管理员权限中间件 (admin.ts)
```typescript
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // 验证管理员权限
  // 检查用户角色
}
```

### 数据验证中间件 (validation.ts)
```typescript
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Zod模式验证
    // 验证请求体、查询参数、路径参数
  }
}
```

### 错误处理中间件 (errorHandler.ts)
```typescript
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // 统一错误处理
  // 日志记录
  // 错误响应格式化
}
```

### 限流中间件 (rateLimiter.ts)
```typescript
export const createRateLimit = (options: RateLimitOptions) => {
  // API限流
  // 防止滥用
}
```

## 守卫系统

### 角色守卫
```typescript
enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff', 
  ADMIN = 'admin'
}

export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 角色权限检查
  }
}
```

### 资源守卫
```typescript
export const resourceOwnerGuard = async (req: Request, res: Response, next: NextFunction) => {
  // 检查用户是否拥有资源访问权限
  // 例如：用户只能访问自己的订单
}
```

### 邀请码守卫
```typescript
export const invitationCodeGuard = async (req: Request, res: Response, next: NextFunction) => {
  // 验证邀请码有效性
  // 检查邀请码使用限制
}
```

## TypeORM 实体设计

### 基础实体
```typescript
@Entity()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 用户实体
```typescript
@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
```

### 商品相关实体
```typescript
@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  images: string[];

  @OneToMany(() => ProductSKU, sku => sku.product)
  skus: ProductSKU[];
}

@Entity('product_skus')
export class ProductSKU extends BaseEntity {
  @Column()
  specification: string;

  @Column('int')
  stock: number;

  @Column('int')
  maxOrderQuantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('jsonb', { nullable: true })
  customAttributes: Record<string, any>;

  @ManyToOne(() => Product, product => product.skus)
  product: Product;

  @OneToMany(() => SKUMaterial, skuMaterial => skuMaterial.sku)
  materials: SKUMaterial[];
}
```

## 服务层设计

### 认证服务
```typescript
export class AuthService {
  async register(data: RegisterData, session: Express.Session): Promise<User>
  async login(email: string, password: string, session: Express.Session): Promise<User>
  async verifyEmail(token: string): Promise<void>
  async logout(session: Express.Session): Promise<void>
  async getCurrentUser(userId: string): Promise<User | null>
}
```

### 订单服务
```typescript
export class OrderService {
  async createOrder(userId: string, orderData: CreateOrderData): Promise<Order>
  async getOrder(orderId: string, userId?: string): Promise<Order>
  async updateOrderStatus(orderId: string, status: OrderStatus, message?: string): Promise<void>
  async getOrderStatusHistory(orderId: string): Promise<OrderStatusLog[]>
  async shipOrder(orderId: string): Promise<void>
}
```

### 通知服务
```typescript
export class NotificationService {
  async sendOrderStatusUpdate(orderId: string): Promise<void>
  async sendEmailVerification(email: string): Promise<void>
  async sendOrderConfirmation(orderId: string): Promise<void>
}
```

## 数据验证模式

### 认证相关
```typescript
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  invitationCode: z.string(),
  verificationCode: z.string().length(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const verifyEmailSchema = z.object({
  token: z.string()
});
```

### 订单相关
```typescript
export const createOrderSchema = z.object({
  items: z.array(z.object({
    skuId: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1),
  shippingAddress: z.string().min(1),
  contactInfo: z.string().min(1)
});
```

## 错误处理

### 错误类型定义
```typescript
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVITATION_CODE_INVALID = 'INVITATION_CODE_INVALID',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  ORDER_LIMIT_EXCEEDED = 'ORDER_LIMIT_EXCEEDED'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}
```

## 环境配置

### .env.example
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oooorder
DB_USERNAME=postgres
DB_PASSWORD=password

# Session配置
SESSION_SECRET=your-session-secret-key
SESSION_MAX_AGE=604800000
# Session存储配置（可选，使用Redis）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 应用配置
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 启动配置

### package.json
```json
{
  "name": "@oooorder/server",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migration:generate": "typeorm-ts-node-commonjs migration:generate",
    "migration:run": "typeorm-ts-node-commonjs migration:run",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "connect-redis": "^7.1.0",
    "redis": "^4.6.10",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.4",
    "nodemailer": "^6.9.7",
    "qrcode": "^1.5.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.17.10",
    "@types/node": "^20.8.7",
    "@types/bcryptjs": "^2.4.6",
    "@types/nodemailer": "^6.4.14",
    "@types/qrcode": "^1.5.5",
    "@types/cors": "^2.8.17",
    "typescript": "^5.2.2",
    "tsx": "^4.1.4"
  }
}
```

## Session配置示例

### config/session.ts
```typescript
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

// Redis客户端（可选，用于生产环境）
const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

export const sessionConfig: session.SessionOptions = {
  name: 'oooorder.sid',
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: process.env.NODE_ENV === 'production' 
    ? new RedisStore({ client: redisClient })
    : undefined, // 开发环境使用内存存储
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800000'), // 7 days
    sameSite: 'lax'
  }
};
```

### app.ts中的Session配置
```typescript
import express from 'express';
import session from 'express-session';
import { sessionConfig } from './config/session';

const app = express();

// Session中间件
app.use(session(sessionConfig));

// 扩展Session类型
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userRole?: string;
    emailVerified?: boolean;
  }
}
```

### 认证控制器示例
```typescript
export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password, req.session);
      
      // 设置session数据
      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.emailVerified = user.emailVerified;
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not log out' });
      }
      res.clearCookie('oooorder.sid');
      res.json({ success: true });
    });
  }

  async me(req: Request, res: Response) {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await this.authService.getCurrentUser(req.session.userId);
    if (!user) {
      req.session.destroy((err) => {});
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified
    });
  }
}
```

这个架构设计提供了：
- 清晰的分层架构（Controller -> Service -> Repository）
- 完整的认证和授权系统
- 灵活的中间件和守卫系统
- 类型安全的数据验证
- 完整的错误处理机制
- 可扩展的服务设计
