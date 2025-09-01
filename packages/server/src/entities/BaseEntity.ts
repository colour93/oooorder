import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity as TypeORMBaseEntity,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
