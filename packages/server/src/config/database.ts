import { DataSource } from 'typeorm';
import { CollectionBatch } from '../entities/CollectionBatch';
import { Equipment } from '../entities/Equipment';
import { InvitationCode } from '../entities/InvitationCode';
import { Material } from '../entities/Material';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { OrderStatusLog } from '../entities/OrderStatusLog';
import { Product } from '../entities/Product';
import { ProductionBatch } from '../entities/ProductionBatch';
import { ProductItem } from '../entities/ProductItem';
import { ProductSKU } from '../entities/ProductSKU';
import { SKUMaterial } from '../entities/SKUMaterial';
import { Staff } from '../entities/Staff';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'oooorder',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Product,
    ProductSKU,
    Material,
    SKUMaterial,
    Equipment,
    Staff,
    ProductionBatch,
    ProductItem,
    CollectionBatch,
    InvitationCode,
    Order,
    OrderItem,
    OrderStatusLog,
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});
