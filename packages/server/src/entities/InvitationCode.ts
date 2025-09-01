import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { InvitationCodeStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { CollectionBatch } from './CollectionBatch';
import { Order } from './Order';

@Entity('invitation_codes')
export class InvitationCode extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column('int')
  maxOrders: number;

  @Column('int')
  maxItemsPerOrder: number;

  @Column('simple-array')
  allowedSkus: string[];

  @Column({ type: 'enum', enum: InvitationCodeStatus, default: InvitationCodeStatus.ACTIVE })
  status: InvitationCodeStatus;

  @Column('int', { default: 0 })
  usedOrders: number;

  @Column()
  batchId: string;

  @ManyToOne(() => CollectionBatch, batch => batch.invitationCodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batchId' })
  collectionBatch: CollectionBatch;

  @OneToMany(() => Order, order => order.invitationCode)
  orders: Order[];
}
