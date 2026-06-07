import { Column, Entity } from 'typeorm';
import { BasicEntity } from '../common/basic.entity';

@Entity('users')
export class User extends BasicEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ nullable: false, length: 50 })
  name: string;
}
