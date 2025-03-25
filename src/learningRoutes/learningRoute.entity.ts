import { User } from '../users/user.entity';
import { BasicEntity } from '../basic.entity';
import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { Session } from '../sessions/session.entity';
import { Topic } from '../topics/topic.entity';

@Entity()
export class LearningRoute extends BasicEntity {
  @Column()
  routeName: string;

  @ManyToMany(() => User, (user) => user.learningRoutes)
  users: User[];

  @OneToMany(() => Session, (sessions) => sessions.learningRoute)
  sessions: Session[];

  @OneToMany(() => Topic, (topics) => topics.learningRoute)
  topics: Topic[];
}
