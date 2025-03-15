import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class BasicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @CreateDateColumn('date')
  createdAt: Date;

  @UpdateDateColumn('date')
  updatedAt: Date;

  @DeleteDateColumn('date')
  deletedAt: Date;
}
