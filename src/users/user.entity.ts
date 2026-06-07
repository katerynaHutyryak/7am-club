import { Column, Entity } from 'typeorm';
import { BasicEntity } from '../common/basic.entity';
import { Role } from './role.enum';

@Entity('users')
export class User extends BasicEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
}
