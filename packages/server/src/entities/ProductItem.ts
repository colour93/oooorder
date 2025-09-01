import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ProductItemStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { OrderItem } from './OrderItem';
import { ProductionBatch } from './ProductionBatch';

@Entity('product_items')
export class ProductItem extends BaseEntity {
  @Column()
  itemCode: string;

  @Column({ nullable: true })
  qrCode: string;

  @Column({ type: 'enum', enum: ProductItemStatus, default: ProductItemStatus.PRODUCED })
  status: ProductItemStatus;

  @Column({ nullable: true })
  packagedAt: Date;

  @Column()
  productionBatchId: string;

  @Column({ nullable: true })
  orderItemId: string;

  @ManyToOne(() => ProductionBatch, batch => batch.productItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productionBatchId' })
  productionBatch: ProductionBatch;

  @OneToOne(() => OrderItem, orderItem => orderItem.productItem)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;
}
