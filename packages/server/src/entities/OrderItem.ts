import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { OrderStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { Order } from './Order';
import { ProductionBatch } from './ProductionBatch';
import { ProductItem } from './ProductItem';
import { ProductSKU } from './ProductSKU';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column('int')
  quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column()
  orderId: string;

  @Column()
  skuId: string;

  @Column({ nullable: true })
  productionBatchId: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => ProductSKU, sku => sku.orderItems)
  @JoinColumn({ name: 'skuId' })
  sku: ProductSKU;

  @ManyToOne(() => ProductionBatch, batch => batch.orderItems, { nullable: true })
  @JoinColumn({ name: 'productionBatchId' })
  productionBatch: ProductionBatch;

  @OneToOne(() => ProductItem, item => item.orderItem)
  productItem: ProductItem;
}
