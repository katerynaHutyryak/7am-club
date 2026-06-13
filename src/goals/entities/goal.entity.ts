import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BasicEntity } from '../../common/basic.entity';
import { User } from '../../users/user.entity';
import { GoalStatus } from '../enums/goal-status.enum';
import { GoalStep } from './goal-step.entity';

@Entity('goals')
export class Goal extends BasicEntity {
  @Column()
  title: string;

  @Column('text')
  motivation: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.Current })
  status: GoalStatus;

  @Column({ type: 'timestamptz', nullable: true })
  dateAchieved: Date | null;

  @Column('simple-array')
  categories: string[];

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => GoalStep, (step) => step.goal, { cascade: true })
  steps: GoalStep[];
}
