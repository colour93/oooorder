import { NextFunction, Request, Response } from 'express';
import { CreateOrderInput, OrderParamsInput, UpdateOrderStatusInput } from '../schemas/order';
import { OrderService } from '../services/OrderService';
import { UserRole } from '../types/common';

export class OrderController {
  private orderService = new OrderService();

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData: CreateOrderInput = req.body;
      const userId = req.user!.id;
      
      const order = await this.orderService.createOrder(userId, orderData);
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
      });
    } catch (error) {
      next(error);
    }
  };

  getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as OrderParamsInput;
      const userId = req.user!.role === UserRole.ADMIN ? undefined : req.user!.id;
      
      const order = await this.orderService.getOrder(id, userId);
      
      res.json({
        success: true,
        order
      });
    } catch (error) {
      next(error);
    }
  };

  getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const orders = await this.orderService.getOrdersByUser(userId);
      
      res.json({
        success: true,
        orders
      });
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getAllOrders();
      
      res.json({
        success: true,
        orders
      });
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as OrderParamsInput; 
      const { status, message }: UpdateOrderStatusInput = req.body;
      
      await this.orderService.updateOrderStatus(id, status, message);
      
      res.json({
        success: true,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as OrderParamsInput;
      const userId = req.user!.role === UserRole.ADMIN ? undefined : req.user!.id;
      
      // 首先验证用户是否有权限访问此订单
      await this.orderService.getOrder(id, userId);
      
      const statusHistory = await this.orderService.getOrderStatusHistory(id);
      
      res.json({
        success: true,
        statusHistory
      });
    } catch (error) {
      next(error);
    }
  };

  shipOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as OrderParamsInput;
      
      await this.orderService.shipOrder(id);
      
      res.json({
        success: true,
        message: 'Order shipped successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
