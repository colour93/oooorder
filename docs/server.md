# 后端模块设计

## 模块划分

### 核心模块

#### 用户认证模块 (AuthModule)
- 用户管理
- 认证鉴权
- 权限控制
- 邮箱验证

**路由设计**:
- POST `/api/auth/login` - 用户登录
- POST `/api/auth/register` - 用户注册
- POST `/api/auth/verify-email` - 邮箱验证
- POST `/api/auth/reset-password` - 密码重置
- GET `/api/auth/profile` - 获取用户信息
- PUT `/api/auth/profile` - 更新用户信息

#### 商品模块 (ProductModule)
- 商品基础信息管理
- SKU管理
- 库存管理
- 商品查询

**路由设计**:
- GET `/api/products` - 商品列表
- POST `/api/products` - 创建商品
- GET `/api/products/:id` - 商品详情
- PUT `/api/products/:id` - 更新商品
- DELETE `/api/products/:id` - 删除商品
- GET `/api/products/:id/skus` - SKU列表
- POST `/api/products/:id/skus` - 创建SKU
- PUT `/api/products/:id/skus/:skuId` - 更新SKU
- PUT `/api/products/:id/skus/:skuId/stock` - 更新库存

#### 制造模块 (ManufacturerModule)
- 设备管理
- 人员管理
- 生产批次管理
- 生产流程追踪

**路由设计**:
- GET `/api/equipment` - 设备列表
- POST `/api/equipment` - 创建设备
- PUT `/api/equipment/:id` - 更新设备
- PUT `/api/equipment/:id/status` - 更新设备状态

- GET `/api/staff` - 人员列表
- POST `/api/staff` - 创建人员
- PUT `/api/staff/:id` - 更新人员信息
- PUT `/api/staff/:id/status` - 更新人员状态

- GET `/api/production/batches` - 生产批次列表
- POST `/api/production/batches` - 创建生产批次
- PUT `/api/production/batches/:id` - 更新批次信息
- PUT `/api/production/batches/:id/status` - 更新批次状态
- POST `/api/production/batches/:id/link-orders` - 关联订单

#### 采集模块 (CollectionModule)
- 采集批次管理
- 邀请码管理
- 采集规则配置
- 数据验证

**路由设计**:
- GET `/api/collection/batches` - 采集批次列表
- POST `/api/collection/batches` - 创建采集批次
- PUT `/api/collection/batches/:id` - 更新批次信息
- PUT `/api/collection/batches/:id/status` - 更新批次状态

- GET `/api/collection/codes` - 邀请码列表
- POST `/api/collection/codes/generate` - 生成邀请码
- GET `/api/collection/codes/:code/validate` - 验证邀请码
- PUT `/api/collection/codes/:id/status` - 更新邀请码状态

#### 订单模块 (OrderModule)
- 订单生命周期管理
- 订单项管理
- 订单状态追踪
- 订单查询

**路由设计**:
- GET `/api/orders` - 订单列表
- POST `/api/orders` - 创建订单
- GET `/api/orders/:id` - 订单详情
- PUT `/api/orders/:id/status` - 更新订单状态
- GET `/api/orders/:id/items` - 订单项列表
- POST `/api/orders/:id/items` - 添加订单项
- DELETE `/api/orders/:id/items/:itemId` - 删除订单项
- GET `/api/orders/tracking/:code` - 订单追踪

#### 通知模块 (NotificationModule)
- 邮件通知
- 实时消息推送
- 通知模板管理
- 通知历史记录

**路由设计**:
- GET `/api/notifications` - 通知列表
- GET `/api/notifications/:id` - 通知详情
- PUT `/api/notifications/:id/read` - 标记通知已读
- GET `/api/notifications/unread-count` - 未读通知数量

**WebSocket 事件**:
- `order:status_update` - 订单状态更新
- `production:batch_update` - 生产批次更新
- `notification:new` - 新通知提醒

### 基础设施模块

#### 数据访问层 (DatabaseModule)
- 数据库连接管理
- 事务管理
- 数据模型映射
- 查询优化

#### 消息服务 (MessageModule)
- 邮件服务
- WebSocket服务
- 消息队列集成
- 消息模板管理

#### 工具服务 (UtilityModule)
- 条码生成解析
- 文件处理
- 数据加密
- 日志管理

**路由设计**:
- POST `/api/utils/qrcode/generate` - 生成条码
- POST `/api/utils/qrcode/parse` - 解析条码
- POST `/api/utils/files/upload` - 文件上传
- GET `/api/utils/files/:id` - 文件下载

## API 响应格式

### 成功响应
```
{
  "success": true,
  "data": {
    // 响应数据
  },
  "meta": {
    // 分页等元数据
  }
}
```

### 错误响应
```
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {
      // 详细错误信息
    }
  }
}
```

## 权限控制

### 角色设计
- 超级管理员
- 管理员
- 生产人员
- 普通用户

### 资源权限
- 读取 (READ)
- 创建 (CREATE)
- 更新 (UPDATE)
- 删除 (DELETE)
- 特殊操作 (SPECIAL)

## 数据流

### 输入流
1. 客户端请求
2. 数据验证
3. 权限检查
4. 业务处理
5. 数据持久化

### 输出流
1. 数据获取
2. 数据转换
3. 权限过滤
4. 响应封装
5. 客户端响应

## 开发规范

### API 设计规范
- 使用复数名词表示资源集合
- 使用 HTTP 方法表示操作类型
- 使用嵌套路由表示资源关系
- 使用查询参数进行过滤和分页
- 使用状态码表示操作结果

### 错误处理
- 业务错误 (4xx)
- 系统错误 (5xx)
- 统一错误响应格式
- 详细错误信息记录