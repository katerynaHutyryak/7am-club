import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BasicEntity } from '../basic.entity';
import { LearningRoute } from 'src/learningRoutes/learningRoute.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BasicEntity {
  @Column('string')
  firstName: string;

  @Column('string')
  lastName: string;

  @Column('string', { unique: true })
  email: string;

  @Column('string')
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ManyToMany(() => LearningRoute, (learningRoute) => learningRoute.user)
  @JoinTable()
  learningRoutes: LearningRoute[];
}
