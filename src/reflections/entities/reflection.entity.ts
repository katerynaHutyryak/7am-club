import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BasicEntity } from '../../common/basic.entity';
import { User } from '../../users/user.entity';

@Entity('reflections')
export class Reflection extends BasicEntity {
  @Column({ type: 'date' })
  periodStart: string;

  @Column({ type: 'date' })
  periodEnd: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  wentWell: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  couldImprove: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  actionItems: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  ideas: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
