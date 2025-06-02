import { User } from 'src/users/entities/user.entity';
import { BasicEntity } from '../../common/basic.entity';
import { LearningRoute } from '../../learningRoutes/entities/learningRoute.entity';
import { Topic } from '../../topics/topic.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Session extends BasicEntity {
  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  finishAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @ManyToOne(() => LearningRoute, (learningRoute) => learningRoute.sessions)
  @JoinColumn()
  learningRoute: LearningRoute;

  @ManyToMany(() => Topic, (topic) => topic.sessions)
  @JoinTable()
  topics: Topic[];
}
