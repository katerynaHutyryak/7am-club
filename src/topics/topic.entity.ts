import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BasicEntity } from 'src/basic.entity';
import { LearningRoute } from 'src/learningRoutes/learningRoute.entity';
import { Session } from 'src/sessions/session.entity';

@Entity()
export class Topic extends BasicEntity {
  @Column()
  name: string;

  @ManyToOne(() => LearningRoute, (learningRoute) => learningRoute.topics)
  learningRoute: LearningRoute;

  @ManyToMany(() => Session, (session) => session.topics)
  sessions: Session[];
}
