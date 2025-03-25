import { BasicEntity } from '../basic.entity';
import { LearningRoute } from '../learningRoutes/learningRoute.entity';
import { Topic } from '../topics/topic.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Session extends BasicEntity {
  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  finishAt: Date;

  @Column()
  duration: number;

  @ManyToOne(() => LearningRoute, (learningRoute) => learningRoute.sessions)
  learningRoute: LearningRoute;

  @ManyToMany(() => Topic, (topic) => topic.sessions)
  @JoinTable()
  topics: Topic[];
}
