import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BasicEntity } from '../basic.entity';
import { LearningRoute } from '../learningRoutes/learningRoute.entity';
import { Session } from '../sessions/session.entity';

@Entity()
export class Topic extends BasicEntity {
  @Column()
  name: string;

  @ManyToOne(() => LearningRoute, (learningRoute) => learningRoute.topics)
  learningRoute: LearningRoute;

  @ManyToMany(() => Session, (session) => session.topics)
  sessions: Session[];
}
