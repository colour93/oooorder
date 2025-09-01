import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { adminMiddleware, authMiddleware, staffMiddleware } from '../middleware/auth';
import { validate, validateParams } from '../middleware/validation';
import {
    createOrderSchema,
    orderParamsSchema,
    updateOrderStatusSchema
} from '../schemas/order';

const router = Router();
const orderController = new OrderController();

// 创建订单（需要认证）
router.post('/',
  authMiddleware,
  validate(createOrderSchema),
  orderController.createOrder
);

// 获取当前用户的订单列表
router.get('/',
  authMiddleware,
  orderController.getUserOrders
);

// 获取单个订单详情
router.get('/:id',
  authMiddleware,
  validateParams(orderParamsSchema),
  orderController.getOrder
);

// 获取订单状态历史
router.get('/:id/status',
  authMiddleware,
  validateParams(orderParamsSchema),
  orderController.getOrderStatus
);

// 管理员获取所有订单
router.get('/admin/all',
  authMiddleware,
  adminMiddleware,
  orderController.getAllOrders
);

// 更新订单状态（员工和管理员）
router.put('/:id/status',
  authMiddleware,
  staffMiddleware,
  validateParams(orderParamsSchema),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

// 发货（员工和管理员）
router.post('/:id/ship',
  authMiddleware,
  staffMiddleware,
  validateParams(orderParamsSchema),
  orderController.shipOrder
);

export default router;
