import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { OrderItem } from './OrderItem';
import { Product } from './Product';
import { ProductionBatch } from './ProductionBatch';
import { SKUMaterial } from './SKUMaterial';

@Entity('product_skus')
export class ProductSKU extends BaseEntity {
  @Column()
  specification: string;

  @Column('int')
  stock: number;

  @Column('int')
  maxOrderQuantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('jsonb', { nullable: true })
  customAttributes: Record<string, any>;

  @Column()
  productId: string;

  @ManyToOne(() => Product, product => product.skus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @OneToMany(() => SKUMaterial, skuMaterial => skuMaterial.sku, { cascade: true })
  materials: SKUMaterial[];

  @OneToMany(() => OrderItem, orderItem => orderItem.sku)
  orderItems: OrderItem[];

  @OneToMany(() => ProductionBatch, batch => batch.sku)
  productionBatches: ProductionBatch[];
}
