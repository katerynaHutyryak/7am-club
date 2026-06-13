import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BasicEntity } from '../../common/basic.entity';
import { GoalStatus } from '../enums/goal-status.enum';
import { Goal } from './goal.entity';

@Entity('goal_steps')
export class GoalStep extends BasicEntity {
  @Column()
  title: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.Locked })
  status: GoalStatus;

  @Column({ type: 'timestamptz', nullable: true })
  dateAchieved: Date | null;

  @Column()
  goalId: string;

  @ManyToOne(() => Goal, (goal) => goal.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'goalId' })
  goal: Goal;
}
