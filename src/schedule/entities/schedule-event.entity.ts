import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BasicEntity } from '../../common/basic.entity';
import { User } from '../../users/user.entity';

@Entity('schedule_events')
export class ScheduleEvent extends BasicEntity {
  @Column()
  title: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  description: string | null;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;

  @Column({ default: false })
  allDay: boolean;

  @Column({ type: 'varchar', length: 20 })
  color: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
