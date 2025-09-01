import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { Order } from './Order';

@Entity('order_status_logs')
export class OrderStatusLog extends BaseEntity {
  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column('text', { nullable: true })
  message: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, order => order.statusLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
