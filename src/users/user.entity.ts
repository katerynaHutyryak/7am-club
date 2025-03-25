import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BasicEntity } from '../basic.entity';
import { LearningRoute } from '../learningRoutes/learningRoute.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BasicEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ManyToMany(() => LearningRoute, (learningRoute) => learningRoute.users)
  @JoinTable()
  learningRoutes: LearningRoute[];
}
