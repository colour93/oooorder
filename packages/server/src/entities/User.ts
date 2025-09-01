import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { Order } from './Order';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
