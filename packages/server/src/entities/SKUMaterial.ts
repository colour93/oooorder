import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Material } from './Material';
import { ProductSKU } from './ProductSKU';

@Entity('sku_materials')
export class SKUMaterial extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  skuId: string;

  @Column()
  materialId: string;

  @ManyToOne(() => ProductSKU, sku => sku.materials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skuId' })
  sku: ProductSKU;

  @ManyToOne(() => Material, material => material.skuMaterials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'materialId' })
  material: Material;
}
