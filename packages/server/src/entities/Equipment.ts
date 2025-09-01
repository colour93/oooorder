import { Column, Entity, OneToMany } from 'typeorm';
import { EquipmentStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { ProductionBatch } from './ProductionBatch';

@Entity('equipment')
export class Equipment extends BaseEntity {
  @Column()
  type: string;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: EquipmentStatus, default: EquipmentStatus.AVAILABLE })
  status: EquipmentStatus;

  @OneToMany(() => ProductionBatch, batch => batch.equipment)
  productionBatches: ProductionBatch[];
}
