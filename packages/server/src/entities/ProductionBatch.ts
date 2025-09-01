import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductionBatchStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { Equipment } from './Equipment';
import { OrderItem } from './OrderItem';
import { ProductItem } from './ProductItem';
import { ProductSKU } from './ProductSKU';
import { Staff } from './Staff';

@Entity('production_batches')
export class ProductionBatch extends BaseEntity {
  @Column()
  batchNumber: string;

  @Column('int')
  quantity: number;

  @Column({ type: 'enum', enum: ProductionBatchStatus, default: ProductionBatchStatus.PLANNED })
  status: ProductionBatchStatus;

  @Column({ nullable: true })
  qrCode: string;

  @Column({ nullable: true })
  producedAt: Date;

  @Column({ nullable: true })
  processedAt: Date;

  @Column()
  skuId: string;

  @Column()
  equipmentId: string;

  @Column()
  staffId: string;

  @ManyToOne(() => ProductSKU, sku => sku.productionBatches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skuId' })
  sku: ProductSKU;

  @ManyToOne(() => Equipment, equipment => equipment.productionBatches)
  @JoinColumn({ name: 'equipmentId' })
  equipment: Equipment;

  @ManyToOne(() => Staff, staff => staff.productionBatches)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @OneToMany(() => ProductItem, item => item.productionBatch, { cascade: true })
  productItems: ProductItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.productionBatch)
  orderItems: OrderItem[];
}
