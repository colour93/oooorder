# OOOrder Server

基于 TypeScript + Express + TypeORM + PostgreSQL 的订单采集和管理系统后端。

## 功能特性

- 🔐 **Session认证系统** - 基于Express Session的用户认证
- 📦 **订单管理** - 完整的订单创建、跟踪和状态管理
- 🏭 **生产管理** - 批次生产、设备和人员管理
- 📧 **邮件通知** - 订单状态变更自动邮件通知
- 🔍 **溯源系统** - 从原料到成品的完整跟踪
- 🛡️ **安全防护** - 完善的中间件和错误处理
- 📊 **数据验证** - 基于Zod的类型安全验证

## 技术栈

- **语言**: TypeScript
- **框架**: Express.js
- **ORM**: TypeORM
- **数据库**: PostgreSQL
- **认证**: Express Session + Redis
- **验证**: Zod
- **邮件**: Nodemailer

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量示例文件：

```bash
cp env.example .env
```

配置环境变量：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oooorder
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Session配置
SESSION_SECRET=your-session-secret-key
SESSION_MAX_AGE=604800000

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

### 3. 数据库设置

确保PostgreSQL服务运行，然后创建数据库：

```sql
CREATE DATABASE oooorder;
```

### 4. 运行迁移

```bash
npm run migration:run
```

### 5. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

## API文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/send-verification` - 发送验证邮件
- `POST /api/auth/verify-email` - 验证邮箱

### 订单接口

- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取用户订单列表
- `GET /api/orders/:id` - 获取订单详情
- `GET /api/orders/:id/status` - 获取订单状态历史
- `PUT /api/orders/:id/status` - 更新订单状态（员工/管理员）
- `POST /api/orders/:id/ship` - 发货（员工/管理员）
- `GET /api/orders/admin/all` - 获取所有订单（管理员）

### 系统接口

- `GET /api/health` - 健康检查
- `GET /api/version` - 版本信息

## 项目结构

```
src/
├── config/          # 配置文件
├── entities/        # TypeORM实体
├── controllers/     # 控制器
├── services/        # 业务逻辑服务
├── middleware/      # 中间件
├── routes/          # 路由定义
├── schemas/         # Zod验证模式
├── types/           # TypeScript类型定义
├── utils/           # 工具函数
├── app.ts           # Express应用配置
└── server.ts        # 服务器启动文件
```

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 生成数据库迁移
npm run migration:generate -- src/migrations/MigrationName

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DB_HOST` | 数据库主机 | localhost |
| `DB_PORT` | 数据库端口 | 5432 |
| `DB_NAME` | 数据库名称 | oooorder |
| `DB_USERNAME` | 数据库用户名 | postgres |
| `DB_PASSWORD` | 数据库密码 | - |
| `SESSION_SECRET` | Session密钥 | - |
| `SESSION_MAX_AGE` | Session过期时间(毫秒) | 604800000 |
| `REDIS_HOST` | Redis主机(可选) | localhost |
| `REDIS_PORT` | Redis端口(可选) | 6379 |
| `SMTP_HOST` | 邮件服务器 | smtp.gmail.com |
| `SMTP_PORT` | 邮件服务器端口 | 587 |
| `SMTP_USER` | 邮件用户名 | - |
| `SMTP_PASS` | 邮件密码 | - |
| `PORT` | 服务器端口 | 3000 |
| `NODE_ENV` | 运行环境 | development |
| `CORS_ORIGIN` | CORS允许源 | http://localhost:5173 |

## 部署

### 生产环境部署

1. 构建项目：
```bash
npm run build
```

2. 设置生产环境变量

3. 运行迁移：
```bash
npm run migration:run
```

4. 启动服务器：
```bash
npm start
```

### Docker部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

## 许可证

MIT License
