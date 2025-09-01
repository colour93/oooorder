import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { InvitationCode } from './InvitationCode';
import { OrderItem } from './OrderItem';
import { OrderStatusLog } from './OrderStatusLog';
import { User } from './User';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('text')
  shippingAddress: string;

  @Column()
  contactInfo: string;

  @Column()
  userId: string;

  @Column()
  invitationCodeId: string;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => InvitationCode, code => code.orders)
  @JoinColumn({ name: 'invitationCodeId' })
  invitationCode: InvitationCode;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderStatusLog, log => log.order, { cascade: true })
  statusLogs: OrderStatusLog[];
}
