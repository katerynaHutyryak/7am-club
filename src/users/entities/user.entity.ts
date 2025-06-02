import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BasicEntity } from '../../common/basic.entity';
import { LearningRoute } from '../../learningRoutes/entities/learningRoute.entity';
import { Session } from '../../sessions/entities/session.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BasicEntity {
  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nickname: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ManyToMany(
    () => LearningRoute,
    (learningRoute) => learningRoute.enrolledUsers,
  )
  @JoinTable()
  enrolledRoutes: LearningRoute[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
