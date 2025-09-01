import { Column, Entity, OneToMany } from 'typeorm';
import { CollectionBatchStatus } from '../types/common';
import { BaseEntity } from './BaseEntity';
import { InvitationCode } from './InvitationCode';

@Entity('collection_batches')
export class CollectionBatch extends BaseEntity {
  @Column()
  name: string;

  @Column()
  deadline: Date;

  @Column({ type: 'enum', enum: CollectionBatchStatus, default: CollectionBatchStatus.ACTIVE })
  status: CollectionBatchStatus;

  @OneToMany(() => InvitationCode, code => code.collectionBatch, { cascade: true })
  invitationCodes: InvitationCode[];
}
