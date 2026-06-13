import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BasicEntity } from '../../common/basic.entity';
import { User } from '../../users/user.entity';
import { Bubble } from './bubble.entity';

@Entity('messages')
export class Message extends BasicEntity {
  @Column('text')
  text: string;

  @Column({ default: false })
  edited: boolean;

  @Column()
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  bubbleId: string;

  @ManyToOne(() => Bubble, (bubble) => bubble.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bubbleId' })
  bubble: Bubble;
}
