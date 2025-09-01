import { Column, Entity, OneToMany } from 'typeorm';
import { StaffStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { ProductionBatch } from './ProductionBatch';

@Entity('staff')
export class Staff extends BaseEntity {
  @Column()
  role: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: StaffStatus, default: StaffStatus.ACTIVE })
  status: StaffStatus;

  @OneToMany(() => ProductionBatch, batch => batch.staff)
  productionBatches: ProductionBatch[];
}
