import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ProductSKU } from './ProductSKU';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  images: string[];

  @OneToMany(() => ProductSKU, sku => sku.product, { cascade: true })
  skus: ProductSKU[];
}
