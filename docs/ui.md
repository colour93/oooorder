# 前端页面设计

## 公共页面

### 登录注册页面 `/auth`
- 邮箱登录表单
- 邮箱注册表单
- 邮箱验证码发送/验证功能

### 首页 `/`
- 项目介绍
- 订单查询入口
- 登录/注册入口

### 订单查询页面 `/order-tracking`
- 订单号/邮箱查询表单
- 订单状态展示
- 订单详情展示
  - 商品信息
  - 生产批次信息
  - 物流信息
  - 状态更新时间线

## 订单采集页面

### 采集码验证页面 `/collection/:code`
- 采集码输入/验证
- 显示采集码相关信息（可下单数量、截止时间等）

### 创建订单页面 `/collection/:code/order`
- 商品选择列表（根据采集码限制）
  - SKU选择
  - 数量选择（考虑库存和最大订单数限制）
- 收货信息表单
  - 收货地址
  - 联系方式
- 邮箱验证（用于账号关联）
- 订单预览
- 提交订单

## 管理后台页面 `/admin/*`

### 管理后台首页 `/admin`
- 数据概览
  - 订单统计
  - 生产统计
  - 库存统计
- 快捷操作入口

### 商品管理 `/admin/products`
- 商品列表
- 商品创建/编辑表单
  - 基本信息
  - 图片上传
  - SKU管理
    - 规格
    - 价格
    - 库存
    - 单订单最大数量

### 制造商管理

#### 设备管理 `/admin/equipment`
- 设备列表
- 设备创建/编辑表单
  - 设备类型
  - 设备编码
  - 设备状态

#### 人员管理 `/admin/staff`
- 人员列表
- 人员创建/编辑表单
  - 基本信息
  - 角色分配
  - 状态管理

### 采集管理

#### 批次管理 `/admin/collection-batches`
- 批次列表
- 批次创建/编辑表单
  - 批次名称
  - 截止时间
  - 状态管理
- 批次详情
  - 关联的采集码列表
  - 订单统计

#### 采集码管理 `/admin/invitation-codes`
- 采集码列表
- 采集码生成表单
  - 关联批次
  - 最大订单数
  - 每单最大商品数
  - 可选SKU限制
- 采集码详情
  - 使用情况
  - 关联订单

### 订单管理 `/admin/orders`
- 订单列表（支持多维度筛选）
- 订单详情
  - 订单信息
  - 商品信息
  - 生产批次关联
  - 状态管理
  - 物流信息

### 生产管理 `/admin/production`
- 生产批次列表
- 生产批次创建
  - 选择SKU
  - 设置数量
  - 分配设备和人员
- 批次详情
  - 一维码生成/打印
  - 订单关联
  - 状态更新

# 路由设计

```typescript
// 使用 TanStack Router 的路由结构

import { createFileRoute } from '@tanstack/react-router'

// 公共路由
const publicRoutes = {
  index: '/',
  auth: '/auth',
  orderTracking: '/order-tracking',
  collection: '/collection/$code',
  createOrder: '/collection/$code/order',
}

// 管理后台路由
const adminRoutes = {
  index: '/admin',
  products: '/admin/products',
  equipment: '/admin/equipment',
  staff: '/admin/staff',
  collectionBatches: '/admin/collection-batches',
  invitationCodes: '/admin/invitation-codes',
  orders: '/admin/orders',
  production: '/admin/production',
}
```

# 页面状态管理

使用 Zustand 管理以下状态：

1. 用户认证状态
```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
```

2. 采集流程状态
```typescript
interface CollectionState {
  invitationCode: InvitationCode | null
  selectedItems: OrderItem[]
  shippingInfo: ShippingInfo
  addItem: (item: OrderItem) => void
  removeItem: (skuId: string) => void
  setShippingInfo: (info: ShippingInfo) => void
  reset: () => void
}
```

3. 管理后台状态
```typescript
interface AdminState {
  filters: Record<string, any>
  pagination: {
    page: number
    pageSize: number
  }
  setFilters: (filters: Record<string, any>) => void
  setPagination: (pagination: { page: number; pageSize: number }) => void
}
```
