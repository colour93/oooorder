import { AppDataSource } from '../config/database';
import { InvitationCode } from '../entities/InvitationCode';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { OrderStatusLog } from '../entities/OrderStatusLog';
import { ProductSKU } from '../entities/ProductSKU';
import { AppError, ErrorCode } from '../middleware/errorHandler';
import { InvitationCodeStatus, OrderStatus } from '../types/common';
import { NotificationService } from './NotificationService';

export interface CreateOrderData {
  items: Array<{
    skuId: string;
    quantity: number;
  }>;
  shippingAddress: string;
  contactInfo: string;
  invitationCode: string;
}

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private orderStatusLogRepository = AppDataSource.getRepository(OrderStatusLog);
  private skuRepository = AppDataSource.getRepository(ProductSKU);
  private invitationCodeRepository = AppDataSource.getRepository(InvitationCode);
  private notificationService = new NotificationService();

  async createOrder(userId: string, orderData: CreateOrderData): Promise<Order> {
    // 验证邀请码
    const invitationCode = await this.invitationCodeRepository.findOne({
      where: { 
        code: orderData.invitationCode,
        status: InvitationCodeStatus.ACTIVE
      },
      relations: ['collectionBatch']
    });

    if (!invitationCode) {
      throw new AppError(ErrorCode.INVITATION_CODE_INVALID, 'Invalid invitation code', 400);
    }

    // 检查邀请码使用限制
    if (invitationCode.usedOrders >= invitationCode.maxOrders) {
      throw new AppError(ErrorCode.ORDER_LIMIT_EXCEEDED, 'Invitation code has reached maximum orders', 400);
    }

    // 检查商品数量限制
    const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > invitationCode.maxItemsPerOrder) {
      throw new AppError(ErrorCode.ORDER_LIMIT_EXCEEDED, 'Order exceeds maximum items per order', 400);
    }

    // 验证SKU和库存
    for (const item of orderData.items) {
      const sku = await this.skuRepository.findOne({
        where: { id: item.skuId }
      });

      if (!sku) {
        throw new AppError(ErrorCode.NOT_FOUND, `SKU ${item.skuId} not found`, 404);
      }

      // 检查是否在允许的SKU列表中
      if (!invitationCode.allowedSkus.includes(item.skuId)) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, `SKU ${item.skuId} is not allowed for this invitation code`, 400);
      }

      // 检查库存
      if (sku.stock < item.quantity) {
        throw new AppError(ErrorCode.INSUFFICIENT_STOCK, `Insufficient stock for SKU ${item.skuId}`, 400);
      }

      // 检查单个商品数量限制
      if (item.quantity > sku.maxOrderQuantity) {
        throw new AppError(ErrorCode.ORDER_LIMIT_EXCEEDED, `Quantity exceeds maximum for SKU ${item.skuId}`, 400);
      }
    }

    // 创建订单
    const order = this.orderRepository.create({
      userId,
      invitationCodeId: invitationCode.id,
      status: OrderStatus.PENDING,
      shippingAddress: orderData.shippingAddress,
      contactInfo: orderData.contactInfo,
    });

    await this.orderRepository.save(order);

    // 创建订单项目并更新库存
    for (const itemData of orderData.items) {
      const orderItem = this.orderItemRepository.create({
        orderId: order.id,
        skuId: itemData.skuId,
        quantity: itemData.quantity,
        status: OrderStatus.PENDING,
      });

      await this.orderItemRepository.save(orderItem);

      // 更新库存
      await this.skuRepository.decrement(
        { id: itemData.skuId },
        'stock',
        itemData.quantity
      );
    }

    // 更新邀请码使用次数
    await this.invitationCodeRepository.increment(
      { id: invitationCode.id },
      'usedOrders',
      1
    );

    // 创建状态日志
    await this.createStatusLog(order.id, OrderStatus.PENDING, 'Order created');

    // 发送通知
    await this.notificationService.sendOrderConfirmation(order.id);

    return await this.getOrder(order.id);
  }

  async getOrder(orderId: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.sku', 'items.sku.product', 'statusLogs']
    });

    if (!order) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Order not found', 404);
    }

    // 如果指定了用户ID，检查所有权
    if (userId && order.userId !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, 'Access denied', 403);
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, message?: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });

    if (!order) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Order not found', 404);
    }

    // 更新订单状态
    await this.orderRepository.update(orderId, { status });

    // 更新订单项目状态
    await this.orderItemRepository.update(
      { orderId },
      { status }
    );

    // 创建状态日志
    await this.createStatusLog(orderId, status, message);

    // 发送状态更新通知
    await this.notificationService.sendOrderStatusUpdate(orderId);
  }

  async getOrderStatusHistory(orderId: string): Promise<OrderStatusLog[]> {
    return await this.orderStatusLogRepository.find({
      where: { orderId },
      order: { createdAt: 'ASC' }
    });
  }

  async shipOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, OrderStatus.SHIPPING, 'Order shipped');
  }

  private async createStatusLog(orderId: string, status: OrderStatus, message?: string): Promise<void> {
    const statusLog = this.orderStatusLogRepository.create({
      orderId,
      status,
      message: message || `Order status changed to ${status}`,
    });

    await this.orderStatusLogRepository.save(statusLog);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.sku', 'items.sku.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.sku', 'items.sku.product'],
      order: { createdAt: 'DESC' }
    });
  }
}
