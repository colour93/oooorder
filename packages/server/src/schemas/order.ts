import { z } from 'zod';
import { OrderStatus } from '../types/common';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    skuId: z.string().uuid('Invalid SKU ID'),
    quantity: z.number().int().positive('Quantity must be positive')
  })).min(1, 'At least one item is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  contactInfo: z.string().min(1, 'Contact info is required'),
  invitationCode: z.string().min(1, 'Invitation code is required')
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  message: z.string().optional()
});

export const orderParamsSchema = z.object({
  id: z.string().uuid('Invalid order ID')
});

export const orderQuerySchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  userId: z.string().uuid().optional(),
  page: z.string().transform(val => parseInt(val)).refine(val => val > 0).optional(),
  limit: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100).optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderParamsInput = z.infer<typeof orderParamsSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
