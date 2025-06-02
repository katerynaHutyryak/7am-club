import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BasicEntity } from '../common/basic.entity';
import { LearningRoute } from '../learningRoutes/entities/learningRoute.entity';
import { Session } from '../sessions/entities/session.entity';

@Entity()
export class Topic extends BasicEntity {
  @Column()
  name: string;

  @ManyToOne(() => LearningRoute, (learningRoute) => learningRoute.topics)
  learningRoute: LearningRoute;

  @ManyToMany(() => Session, (session) => session.topics)
  sessions: Session[];
}
