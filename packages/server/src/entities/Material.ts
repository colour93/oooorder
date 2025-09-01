import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { SKUMaterial } from './SKUMaterial';

@Entity('materials')
export class Material extends BaseEntity {
  @Column()
  name: string;

  @Column()
  unit: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costQuantity: number;

  @OneToMany(() => SKUMaterial, skuMaterial => skuMaterial.material, { cascade: true })
  skuMaterials: SKUMaterial[];
}
