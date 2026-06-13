import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BasicEntity } from '../../common/basic.entity';
import { User } from '../../users/user.entity';
import { Visibility } from '../enums/visibility.enum';
import { Message } from './message.entity';

@Entity('bubbles')
export class Bubble extends BasicEntity {
  @Column()
  name: string;

  @Column('text')
  topic: string;

  @Column({ default: 0 })
  colorIndex: number;

  @Column({ type: 'enum', enum: Visibility, default: Visibility.Public })
  visibility: Visibility;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToMany(() => User)
  @JoinTable({ name: 'bubble_members' })
  members: User[];

  // jsonb preserves array structure; simple-array (CSV text) breaks on commas in values
  @Column({ type: 'jsonb', nullable: true, default: [] })
  invitedEmails: string[];

  @OneToMany(() => Message, (msg) => msg.bubble, { cascade: true })
  messages: Message[];
}
