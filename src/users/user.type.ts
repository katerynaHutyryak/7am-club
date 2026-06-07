import { Role } from './role.enum';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}
